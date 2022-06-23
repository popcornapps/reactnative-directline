import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import ParsedText from 'react-native-parsed-text';

export default function Bubble(props: any) {
  const renderMessageText = () => {
    const { text } = props.currentMessage;
    if (text) {
      return (
        <ParsedText
          style={[
            styles.text,
            { color: props?.position === 'right' ? 'white' : undefined },
          ]}
          parse={[
            {
              type: 'url',
              style: [
                styles.url,
                { color: props?.position === 'right' ? 'white' : '#73b9ff' },
              ],
              onPress: onUrlPress,
            },
          ]}
        >
          {text}
        </ParsedText>
      );
    }

    return null;
  };

  const onUrlPress = (url: string) => {
    if (/^www\./i.test(url)) {
      onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          console.error('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  };

  return (
    <View
      style={[
        props.containerStyle,
        props.position === 'left'
          ? styles.leftContainer
          : styles.rightContainer,
      ]}
    >
      <View
        style={
          props.position === 'left' ? styles.leftWrapper : styles.rightWrapper
        }
      >
        {renderMessageText()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  leftWrapper: {
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#73b9ff',
    marginLeft: 10,
    padding: 10,
    marginBottom: 10,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightWrapper: {
    borderRadius: 20,
    backgroundColor: '#73b9ff',
    marginLeft: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
    padding: 10,
    marginBottom: 10,
    marginRight: 16,
  },
  url: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
