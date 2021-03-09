import React, { useState, useEffect } from 'react';

import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';

const UploadCSV = () => {
  const [fileList, setFileList] = useState([]);
  const store = useStore();

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const customUpload = async ({
    onSuccess, onError, file, onProgress,
  }) => {
    console.log(file);
    // if (!(file.type === 'application/vnd.ms-excel')) {
    if (false) {
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
