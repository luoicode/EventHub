import {Platform, StyleSheet} from 'react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },

  text: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: appColors.text,
  },

  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    // minHeight: 56,
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  section: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D56F0',
    width: 30,
    height: 30,
    borderRadius: 100,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    // backgroundColor: appColors.white,
    borderRadius: 100,
    // marginRight: 12,
  },

  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: appColors.white,
    marginHorizontal: 12,
    marginVertical: 6,
    marginBottom: 16,
  },
  noSpaceCard: {
    alignItems: 'center',
    width: 45,
    margin: 0,
    padding: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    marginBottom: 0,
    height: 45,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'grey',
    height: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    borderRadius: 30,
    paddingLeft: 10,
    color: 'black',
    // placeholderTextColor: 'gray',
  },
  sendButton: {
    backgroundColor: '#67C6E3',
    padding: 16,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 99999,
    marginHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const giftedChatStyles = {
  inputToolbar: {display: 'none'},
};
