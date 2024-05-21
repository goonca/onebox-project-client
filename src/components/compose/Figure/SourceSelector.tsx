import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  TextField
} from '@mui/material';
import { Draggable } from 'pages/__dashboard/__parts/Draggable/Draggable';
import React, { useEffect, useRef, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { FileModel } from 'shared/types/api-type';
import style from './SourceSelector.module.scss';

export type SourceSelectorProps = {
  opened?: boolean;
  onCornfirm?: (key?: string) => void;
  onCancel?: () => void;
  extraFooter?: React.ReactElement;
};

export const SourceSelector = (props: SourceSelectorProps) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('1');
  const urlRef = useRef<typeof TextField>();

  const { getFiles } = useServices();
  const [files, setFiles] = useState<FileModel[]>();

  const handleCancel = () => {
    //setOpened(false);
    props.onCancel && props.onCancel();
  };

  const handleConfirm = (file: FileModel) => {
    //setOpened(false);
    props.onCornfirm && props.onCornfirm(file.key);
  };

  const listFiles = async () => {
    const files = await getFiles();
    setFiles(files.data);
  };

  useEffect(() => {
    listFiles();
  }, []);

  const onUpload = (files?: FileModel[]) => {
    console.log(files);
    handleConfirm(files?.length ? files[0] : {});
    //listFiles();
  };

  useEffect(() => {
    setOpened(!!props.opened);
  }, [props]);
  return (
    <Dialog
      fullScreen={false}
      className={style['source-dialog']}
      open={!!opened}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Select Photo</DialogTitle>
      <DialogContent>
        <DialogContentText height={400}>
          <div className={style['tab-editor']}>
            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(e, value) => setSelectedTab(value)}>
                  <Tab label="My files" value="1" />
                  <Tab label="Upload" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className={style['content']}>
                  <div className={style['tile']}></div>
                  <div className={style['tile']}></div>
                  <div className={style['tile']}></div>
                  {files &&
                    files.map(file => {
                      return (
                        <div
                          className={`${style['tile']} ${style['selectable']}`}
                          onClick={() => handleConfirm(file)}
                          key={file.id}
                        >
                          <img
                            width={200}
                            src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${file.key}`}
                          />
                        </div>
                      );
                    })}
                </div>
              </TabPanel>
              <TabPanel value="2">
                <Draggable
                  onUpload={onUpload}
                  showPreview={true}
                  style={{ height: '300px' }}
                />
              </TabPanel>
            </TabContext>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button variant="outlined" size="small" onClick={handleCancel}>
          Cancel
        </Button>
        {props.extraFooter && props.extraFooter}
      </DialogActions>
    </Dialog>
  );
};
