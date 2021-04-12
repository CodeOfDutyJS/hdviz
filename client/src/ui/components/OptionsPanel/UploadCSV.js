import React, { useState } from 'react';

import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useStore2 } from '../../../store/RootStore';

const UploadCSV = () => {
  const { modelStore } = useStore2();
  const [fileList, setFileList] = useState([]);

  const isCSV = (type) => type === 'application/vnd.ms-excel' || type === 'text/csv';

  const onFileUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const customUpload = async ({
    onSuccess, onError, file,
  }) => {
    console.log(file);
    if (!isCSV(file.type)) {
      onError(file);
    } else {
      await modelStore.uploadCSV(file);
      if (modelStore.loadingCompleted) {
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
