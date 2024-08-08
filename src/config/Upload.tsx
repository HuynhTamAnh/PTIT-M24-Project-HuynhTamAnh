import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Button, Upload as AntUpload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../config/index";

interface UploadProps {
  onClose?: () => void;
}

const Upload: React.FC<UploadProps> = ({ onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      message.error("Please choose files to upload");
      return;
    }
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });
      const downloadUrls = await Promise.all(uploadPromises);
      setUrls((prevUrls) => [...prevUrls, ...downloadUrls]);
      message.success("Files uploaded successfully");
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      message.error("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  const props = {
    onRemove: (file: File) => {
      const index = files.indexOf(file);
      const newFileList = files.slice();
      newFileList.splice(index, 1);
      setFiles(newFileList);
    },
    beforeUpload: (file: File) => {
      setFiles((prevFiles) => [...prevFiles, file]);
      return false;
    },
    fileList: files,
  };

  return (
    <div>
      <AntUpload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </AntUpload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={files.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </div>
  );
};

export default Upload;
