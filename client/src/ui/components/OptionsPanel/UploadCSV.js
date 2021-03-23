import React, { useState, useEffect } from 'react';

import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useStore } from '../../../controller/ControllerProvider';

const UploadCSV = () => {
  const [fileList, setFileList] = useState([]);
  const store = useStore();

  const isCSV = (type) => type === 'application/vnd.ms-excel' || type === 'text/csv';

  const onFileUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const customUpload = async ({
    onSuccess, onError, file, onProgress,
  }) => {
    console.log(file);
    if (!isCSV(file.type)) {
      onError(file);
    } else {
      await store.uploadCSV(file);
      if (await store.loadingCompleted) {
        onSuccess(file);
      } else {
        onError(file);
      }
    }
  };

  return (
    <Upload
      onChange={onFileUploadChange}
      multiple={false}
      accept=".csv"
      listType="picture"
      customRequest={customUpload}
      fileList={fileList}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default UploadCSV;
