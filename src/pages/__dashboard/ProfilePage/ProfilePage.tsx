import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faYoutube,
  faFacebook,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
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

export const ProfilePage = () => {
  const currentUser = useContext(UserContext);
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [showAvatar, setShowAvatar] = useState<boolean>(true);
  const [avatarKey, setAvatarKey] = useState<string | undefined>(
    currentUser?.avatar as string
  );

  const { updateUser } = useServices();
  const refEmail = useRef<HTMLInputElement>();
  const refName = useRef<HTMLInputElement>();
  const refDescription = useRef<HTMLInputElement>();
  const refInstagram = useRef<HTMLInputElement>();
  const refYoutube = useRef<HTMLInputElement>();
  const refTwitter = useRef<HTMLInputElement>();
  const refFacebook = useRef<HTMLInputElement>();
  const refAccountAvatar = useRef<HTMLDivElement>(null);

  const saveUser = async () => {
    console.log(refName.current?.value);

    const user: UserModel = {
      name: refName.current?.value,
      description: refDescription.current?.value,
      email: refEmail.current?.value,
      instagram: refInstagram.current?.value,
      youtube: refYoutube.current?.value,
      twitter: refTwitter.current?.value,
      facebook: refFacebook.current?.value,
      avatar: avatarKey
    };
    const updatedUser = await updateUser(user);
  };

  const handleConfirm = (key?: string) => {
    setAvatarKey(key);
    setDialogOpened(false);
  };

  const handleCancel = () => {
    setDialogOpened(false);
  };
  const handleAvatarOnload = () => {
    setShowAvatar(false);
  };

  const removeAvatar = () => {
    setAvatarKey('');
    setDialogOpened(false);
  };

  return (
    <>
      <div className={style['profile-page']}>
        <div className={style['header']}>
          <div>
            <h2>Profile</h2>
          </div>
          <div>
            <Button variant="contained" size="small">
              Change password
            </Button>
            <Button
              variant="contained"
              size="small"
              data-dark
              onClick={saveUser}
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
                  onClick={() => setDialogOpened(true)}
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
                  defaultValue={currentUser?.email}
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
      </div>
      <SourceSelector
        opened={dialogOpened}
        onCornfirm={handleConfirm}
        onCancel={handleCancel}
        extraFooter={
          <Button variant="contained" size="small" onClick={removeAvatar}>
            Remove avatar
          </Button>
        }
      />
    </>
  );
};
