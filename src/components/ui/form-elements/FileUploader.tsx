import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { useTheme } from "../../../hooks/useTheme";

import cn from "clsx";
import { getMedia } from "../../../utils";

interface IFileUploader {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: IFileUploader) => {
  const { isDarkMode } = useTheme();

  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={
                fileUrl?.split("/")?.includes("upload")
                  ? getMedia(fileUrl)
                  : fileUrl
              }
              alt="image"
              className={cn("file_uploader-img object-cover", {
                "!fill-black": !isDarkMode,
              })}
            />
          </div>
          <p className="file_uploader-label text-main-color">
            Нажмите или перетащите фотографию, чтобы заменить ее.
          </p>
        </>
      ) : (
        <div className="file_uploader-box bg-second-color rounded-[14px]">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
            className="object-cover"
          />

          <h3 className="base-medium text-main-color mb-2 mt-6">
            Перетащите фото сюда
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <button className="shad-button_dark_4 text-main-color bg-main-color flex-center rounded-[10px] max-sm:!hidden">
            Выбрать с компьютера
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
