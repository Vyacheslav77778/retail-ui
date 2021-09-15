import React, { ComponentType, PropsWithChildren, useCallback, useState } from 'react';
import { useContextValue } from '../../hooks/useContextValue';
import { IUploadFile, UploadFileStatus } from '../../lib/fileUtils';
import { UploadFilesContext } from './UploadFilesContext';
import { IFileAttacherBaseProps } from './FileAttacherBase';
import { ValidationResult } from './ValidationResult';
import { useControlLocale } from './FileAttacherBaseHooks';

export interface IUploadFilesProviderProps {
  onChange?: (files: IUploadFile[]) => void;
  onRemove?: (fileId: string) => void;
}

const updateFile = (
  files: IUploadFile[],
  fileId: string,
  getFileUpdatedProps: (file: IUploadFile) => Partial<IUploadFile>
): IUploadFile[] => {
  const fileIndex = files.findIndex(file => file.id === fileId);
  if (fileIndex === -1) return files;

  const newFiles = [...files];
  const file = files[fileIndex];

  const updatedProps = getFileUpdatedProps(file);

  newFiles[fileIndex] = {
    ...file,
    ...updatedProps
  };

  return newFiles;
};

// FIXME @mozalov: вынести валидацию вне файла или нет? (возможна нужна для того, чтобы вне контрола понимали состояние валидности)
// FIXME @mozalov: подумать, возможно пригодится для умного тоста

export const UploadFilesProvider = (props: PropsWithChildren<IUploadFilesProviderProps>) => {
  const {children, onChange, onRemove} = props;

  // в files попадат только те, что попали в onSelect
  const [files, setFiles] = useState<IUploadFile[]>([]);
  const locale = useControlLocale();

  const setFileStatus = useCallback((fileId: string, status: UploadFileStatus) => {
    setFiles(files => {
      return updateFile(files, fileId, file => {
        return {
          status,
          validationResult: status === UploadFileStatus.Error
            ? ValidationResult.error(locale.requestErrorText)
            : file.validationResult
        };
      });
    });
  }, [locale]);

  const handleExternalSetFiles = useCallback((files: IUploadFile[]) => {
    setFiles(state => {
      const newFiles = [...state, ...files];
      onChange && onChange(newFiles);
      return newFiles;
    });
  }, [onChange])

  const removeFile = useCallback((fileId: string) => {
    onRemove && onRemove(fileId);
    setFiles(state => {
      const newFiles = state.filter(file => file.id !== fileId);
      onChange && onChange(newFiles);
      return newFiles;
    });
  }, [onChange, onRemove]);

  const setFileValidationResult = useCallback((fileId: string, validationResult: ValidationResult) => {
    setFiles(files => updateFile(files, fileId, () => ({validationResult})));
  }, []);

  return (
    <UploadFilesContext.Provider value={useContextValue({
      setFileStatus,
      files,
      setFiles: handleExternalSetFiles,
      removeFile,
      setFileValidationResult
    })}>
      {children}
    </UploadFilesContext.Provider>
  );
};

UploadFilesProvider.displayName = 'UploadFilesProvider';

export const withUploadFilesProvider = <TProps extends IFileAttacherBaseProps>(WrappedComponent: ComponentType<TProps>) => (props: TProps) => (
  <UploadFilesProvider {...props}>
    <WrappedComponent {...props} />
  </UploadFilesProvider>
);
