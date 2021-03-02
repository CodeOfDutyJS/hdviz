import React, { useState, useEffect } from 'react';

import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadCSV = () => {
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const customUpload = ({
    onSuccess, onError, file, onProgress,
  }) => {
    if (!(file.type === 'application/vnd.ms-excel')) {
      onError(file);
    } else {
      onSuccess(file);
    }
  };

  const props = {
    onChange,
    multiple: false,
    accept: '.csv',
    listType: 'picture',
    // beforeUpload(file) {
    //   console.log(fileList);
    // },
    customRequest: customUpload,
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Upload {...props} fileList={fileList}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default UploadCSV;
