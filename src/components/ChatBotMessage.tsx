import {
  Linking,
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import React, { useRef } from 'react';
import { Day, utils } from 'react-native-gifted-chat';
import Bubble from './Bubble';
import Carousel from 'react-native-snap-carousel';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import uuid from 'uuid';

const { isSameUser, isSameDay } = utils;
const ScreenWidth = Dimensions.get('window').width;

const ChatBotMessage = (props: any) => {
  const getInnerComponentProps = () => {
    const isMe =
      props?.currentMessage?.from?.name === props?.userObj?.name ||
      props?.currentMessage?.user?.name === props?.userObj?.name;

    return {
      ...props,
      position: isMe ? 'right' : 'left',
      isSameUser,
      isSameDay,
    };
  };

  const innerProps = getInnerComponentProps();

  const renderDay = () => {
    if (props.currentMessage.createdAt) {
      const dayProps = getInnerComponentProps();
      if (props.renderDay) {
        return props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  };

  const renderBubble = () => {
    const bubbleProps = getInnerComponentProps();

    return <Bubble {...bubbleProps} />;
  };
  const carouselRef = useRef<any>(null);

  const renderAttachments = () => {
    const attachmentsProp = getInnerComponentProps();
    const { attachments } = attachmentsProp?.currentMessage;

    const _renderItem = ({ item }: any) => {
      return (
        <View
          style={[
            styles._renderItemContainer,
            { height: item?.content?.images ? 320 : 250 },
          ]}
        >
          {item?.content?.images && (
            <Image
              source={item?.content?.images}
              resizeMode="cover"
              style={styles?._renderItemImage}
            />
          )}
          <Text style={styles?._renderItemTitle} numberOfLines={1}>
            {item?.content?.title}
          </Text>
          {(item?.content?.subtitle && (
            <Text style={styles?._renderItemSubtitle} numberOfLines={2}>
              {item?.content?.subtitle}
            </Text>
          )) ||
            (item?.content?.text && (
              <Text style={styles?._renderItemSubtitle}>
                {item?.content?.text}
              </Text>
            ))}
          <View style={styles?._renderItemButton}>
            {item?.content?.buttons?.map((button: any) => {
              return (
                <View style={styles?._renderItemBorder}>
                  <Text
                    style={styles.btnTextStyle}
                    suppressHighlighting
                    onPress={async () => {
                      const url = button?.value;
                      if (button?.type === 'openUrl') {
                        await Linking.openURL(url);
                      } else {
                        props?.onSend([
                          {
                            text: button?.title,
                            user: props?.userObj,
                            _id: uuid?.v4(),
                            createdAt: new Date(),
                          },
                        ]);
                      }
                    }}
                  >
                    {button?.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    };

    return (
      <>
        {attachments && attachments.length > 0 && (
          <Carousel
            ref={carouselRef}
            data={attachments}
            renderItem={_renderItem}
            contentContainerCustomStyle={{ paddingLeft: 17 }}
            sliderWidth={ScreenWidth}
            itemWidth={ScreenWidth - 50}
            lockScrollWhileSnapping
          />
        )}
      </>
    );
  };

  const renderQuickReplies = () => {
    return (
      <View style={styles.quickReplyContainer}>
        <QuickReplies
          currentMessage={props?.currentMessage}
          onQuickReply={props?.onQuickReply}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderDay()}
      <View
        style={
          innerProps?.position === 'left'
            ? styles?.containerLeft
            : styles?.containerRight
        }
      >
        {props?.currentMessage?.text ? renderBubble() : null}
      </View>
      {renderAttachments()}
      {props?.currentMessage?.quickReplies ? renderQuickReplies() : null}
    </View>
  );
};

export default ChatBotMessage;

const styles = StyleSheet.create({
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  containerRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 0,
  },
  _renderItemContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#73b9ff',
  },
  _renderItemBorder: { borderTopWidth: 1, borderColor: '#73b9ff' },
  _renderItemTitle: {
    marginHorizontal: 10,
    marginVertical: 12,
    fontWeight: '600',
    fontSize: 20,
  },
  _renderItemImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  _renderItemButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  _renderItemSubtitle: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  quickReplyContainer: { marginLeft: 15, marginBottom: 10 },
  btnTextStyle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#2089dc',
    padding: 8,
  },
});
