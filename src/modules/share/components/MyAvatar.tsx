//
import { MAvatar } from './@material-extend';
import { MAvatarProps } from './@material-extend/MAvatar';
import createAvatar from 'src/modules/share/utils/createAvatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: MAvatarProps) {
  //TODO: get user from whatever store and pass to the user constant
  const user = {
    photoURL: '',
    displayName: 'Default',
  };

  return (
    <MAvatar
      src={user?.photoURL}
      alt={user?.displayName}
      color={user?.photoURL ? 'default' : createAvatar(user?.displayName).color}
      {...other}
    >
      {createAvatar(user?.displayName).name}
    </MAvatar>
  );
}
