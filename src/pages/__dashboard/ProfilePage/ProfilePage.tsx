import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faYoutube,
  faFacebook,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  InputAdornment,
  Snackbar,
  TextField
} from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import style from './ProfilePage.module.scss';
import { AccountCircle } from '@mui/icons-material';
import { UserModel } from 'shared/types/api-type';
import { useServices } from 'shared/hooks/useServices';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { SourceSelector } from 'components/compose/Figure/SourceSelector';
import { InputPassword } from 'components/global/InputPassword/InputPassword';
import { SnackBarType } from 'shared/types/SnackBarType';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import { useValidation } from 'shared/hooks/useValidation';
import { EventType, useEvent } from 'shared/hooks/useEvent';

export const ProfilePage = () => {
  const currentUser = useContext(UserContext);
  const { isMobile } = useMediaQuery();
  const { trigger } = useEvent();
  const [sourceDialogOpened, setSourceDialogOpened] = useState<boolean>(false);
  const [passwordDialogOpened, setPasswordDialogOpened] =
    useState<boolean>(false);
  const [showAvatar, setShowAvatar] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [avatarKey, setAvatarKey] = useState<string | undefined>(
    currentUser?.avatar as string
  );

  const { updateUser, updatePassword } = useServices();
  const { validateEmail } = useValidation();
  const refEmail = useRef<HTMLInputElement>();
  const refName = useRef<HTMLInputElement>();
  const refDescription = useRef<HTMLInputElement>();
  const refInstagram = useRef<HTMLInputElement>();
  const refYoutube = useRef<HTMLInputElement>();
  const refTwitter = useRef<HTMLInputElement>();
  const refFacebook = useRef<HTMLInputElement>();
  const refOldPassword = useRef<typeof InputPassword>(null);
  const refNewPassword = useRef<typeof InputPassword>(null);
  const refConfirmNewPassword = useRef<typeof InputPassword>(null);

  const saveUser = async () => {
    const user: UserModel = {
      name: refName.current?.value,
      description: refDescription.current?.value,
      email: !!refEmail.current?.value ? refEmail.current?.value : undefined,
      instagram: refInstagram.current?.value,
      youtube: refYoutube.current?.value,
      twitter: refTwitter.current?.value,
      facebook: refFacebook.current?.value,
      avatar: avatarKey
    };

    const response = await updateUser(user);
    //console.log(response);
    trigger(EventType.UPDATE_CURRENT_USER, response);
  };

  const handleConfirm = (key?: string) => {
    setAvatarKey(key);
    setSourceDialogOpened(false);
  };

  const handleCancel = () => {
    setSourceDialogOpened(false);
  };
  const handleAvatarOnload = () => {
    setShowAvatar(false);
  };

  const handleValidateEmail = (e: React.FocusEvent<HTMLInputElement>) => {
    const isValid = validateEmail(refEmail.current?.value as string);
    if (!isEmailValid) {
      setIsEmailValid(isValid);
    } else if (e.type === 'blur') {
      setIsEmailValid(isValid);
    }
  };

  const handleChangePassword = async () => {
    const result = await updatePassword({
      oldPassword: (refOldPassword.current as any).value,
      newPassword: (refNewPassword.current as any).value,
      confirmNewPassword: (refConfirmNewPassword.current as any).value
    });

    setPasswordDialogOpened(result.status == 1);
  };

  const removeAvatar = () => {
    setAvatarKey('');
    setSourceDialogOpened(false);
  };

  return (
    <>
      <div className={style['profile-page']}>
        <div className={style['header']}>
          <div>
            <h2>Profile</h2>
          </div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={() => setPasswordDialogOpened(true)}
            >
              Change password
            </Button>
            <Button
              variant="contained"
              size="small"
              data-dark
              onClick={saveUser}
              disabled={!isEmailValid}
            >
              Save
            </Button>
          </div>
        </div>
        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <div className={style['content']}>
              <div className={style['account-cover']}>
                {(showAvatar || !!!avatarKey) && <AccountCircle />}

                <img
                  src={
                    !!avatarKey
                      ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${avatarKey}`
                      : undefined
                  }
                  style={{ visibility: !!avatarKey ? 'visible' : 'hidden' }}
                  onLoad={handleAvatarOnload}
                />

                <span
                  className={style['edit-pencil']}
                  onClick={() => setSourceDialogOpened(true)}
                >
                  <FontAwesomeIcon icon={faPencil} />
                </span>
              </div>
              <h2 className={style['account-name']}>{currentUser?.name}</h2>
              <p className={style['account-username']}>
                @{currentUser?.username}
              </p>
            </div>
          </div>
          <div className={style['right-side']}>
            <div className={style['content']}>
              <div className={style['header']}>
                <div>
                  <h2>Personal Data</h2>
                </div>
              </div>
              <FormControl>
                <TextField
                  label="Email"
                  variant="outlined"
                  inputRef={refEmail}
                  {...{
                    error: isEmailValid ? undefined : true,
                    helperText: isEmailValid
                      ? undefined
                      : 'MSG_ERR_INVALID_EMAIL'
                  }}
                  defaultValue={currentUser?.email}
                  onChange={handleValidateEmail}
                  onBlur={handleValidateEmail}
                />
                <TextField
                  label="Name"
                  variant="outlined"
                  inputRef={refName}
                  defaultValue={currentUser?.name}
                />
                <TextField
                  inputRef={refDescription}
                  label="About you"
                  variant="outlined"
                  multiline
                  maxRows={6}
                  minRows={3}
                  defaultValue={currentUser?.description}
                />
                <div className={style['social-media-label']}>
                  <FormLabel>Social Media</FormLabel>
                </div>
                <div className={style['social-media-wrapper']}>
                  <TextField
                    inputRef={refInstagram}
                    label="Instagram"
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faInstagram} />
                        </InputAdornment>
                      )
                    }}
                    defaultValue={currentUser?.instagram}
                  />
                  <TextField
                    inputRef={refYoutube}
                    label="Youtube"
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faYoutube} />
                        </InputAdornment>
                      )
                    }}
                    defaultValue={currentUser?.youtube}
                  />
                  <TextField
                    inputRef={refTwitter}
                    label="X-Twitter"
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faXTwitter} />
                        </InputAdornment>
                      )
                    }}
                    defaultValue={currentUser?.twitter}
                  />
                  <TextField
                    inputRef={refFacebook}
                    label="Facebook"
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFacebook} />
                        </InputAdornment>
                      )
                    }}
                    defaultValue={currentUser?.facebook}
                  />
                </div>
              </FormControl>
            </div>
          </div>
        </div>
        <SourceSelector
          opened={sourceDialogOpened}
          onCornfirm={handleConfirm}
          onCancel={handleCancel}
          extraFooter={
            <Button variant="contained" size="small" onClick={removeAvatar}>
              Remove avatar
            </Button>
          }
        />
        <Dialog fullScreen={isMobile()} open={passwordDialogOpened}>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent>
            <DialogContentText minWidth={500} minHeight={40}>
              <InputPassword label="Old password" ref={refOldPassword} />
              <div>
                <InputPassword label="New password" ref={refNewPassword} />
                <InputPassword
                  label="Repeat new password"
                  ref={refConfirmNewPassword}
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={style['dialog-actions']}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPasswordDialogOpened(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleChangePassword}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
