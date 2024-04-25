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
    fontSize: 18,
    color: appColors.primary7,
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
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: appColors.primary7,
    width: '100%',
    minHeight: 56,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.primary5,
    marginBottom: 19,
  },

  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    // paddingHorizontal: 14,
    color: appColors.primary7,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
