import React, {useRef, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';

interface ListItem {
  id: number;
  title: string;
  image: string;
}

const Galerrycamera: React.FC = () => {
  const [ListItems, setListItems] = useState<ListItem[]>([]);
  const [title, settitle] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [isAddElement, setIsAddElement] = useState<boolean>(false);
  const [isEditElement, setisEditElement] = useState<boolean>(false);
  const [isBorder, isSetBorder] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleFocusRef = (): void => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleModalFeedback = (): void => {
    setisEditElement(false);
    setIsAddElement(false);
    setIsFocused(false);
    settitle('');
    setImage(null);
  };
  const handleChoosePhoto = () => {
    try {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        compressImageQuality: 0.7,
        includeBase64: false,
      })
        .then(image => {
          if (image) {
            setImage(image.path);
          }
        })
        .catch(error => {
          console.log('ImagePicker Error: ', error);
        });
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };
  const handleSelectedItem = (id: number) => {
    setSelectedItem(id);
    isSetBorder(true);
  };

  const handleAddListItem = () => {
    if (title && image) {
      if (editItemId !== null) {
        const updatedItems = ListItems.map(item =>
          item.id === editItemId ? {id: item.id, title, image} : item,
        );
        setListItems(updatedItems);
        setEditItemId(null);
      } else {
        const newListItem: ListItem = {id: Date.now(), title, image};
        setListItems([...ListItems, newListItem]);
      }
      settitle('');
      setIsFocused(false);
      setImage(null);
      setIsAddElement(!isAddElement);
    }
  };

  const handleEdit = (id: number, image: string) => {
    setIsAddElement(true);
    setisEditElement(true);
    setEditItemId(id);
    settitle(ListItems.find(item => item.id === id)?.title || '');
    setImage(image);
  };

  const handleUpdateElement = () => {
    if (editItemId !== null && title && image) {
      const updatedItems = ListItems.map(item =>
        item.id === editItemId ? {id: item.id, title, image} : item,
      );
      setListItems(updatedItems);
      setEditItemId(null);
      setIsAddElement(false);
    }
  };
  const handleDelete = (id: number) => {
    const updatedItems = ListItems.filter(item => item.id !== id);
    setListItems(updatedItems);
  };
  const renderButton = () => (
    <View>
      <TouchableOpacity
        style={styles.addButtonElement}
        onPress={() => setIsAddElement(true)}>
        <View style={styles.plusViewStyle}>
          <Text style={styles.plusTextStyle}>+</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.addNewViewStyle}>
        <Text style={styles.addNewStyle}>addNew</Text>
      </View>
    </View>
  );

  const renderItem = ({item, index}: {item: ListItem; index: number}) => (
    <View
      style={[
        styles.listItemStyle,
        index % 2 !== 0 && styles.listItemGapStyle,
      ]}>
      <View style={styles.ListItemViewStyle}>
        <TouchableOpacity
          onPress={() => handleSelectedItem(item.id)}
          style={styles.selectedItemStyle}>
          <Image
            source={{uri: item.image}}
            style={[
              styles.imageStyle,
              isBorder &&
                selectedItem === item.id && {
                  borderWidth: 2,
                  borderColor: '#36CC55',
                },
            ]}
          />
          <View style={styles.titleViewStyle}>
            <Text style={styles.titleStyle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
        {isBorder && selectedItem === item.id ? (
          <View style={styles.editDeleteViewStyle}>
            <TouchableOpacity
              onPress={() => handleEdit(item.id, item.image)}
              style={styles.buttonEditStyle}>
              <FeatherIcon
                name="edit-3"
                color="white"
                size={20}
                style={styles.buttonTextStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.buttonDeleteStyle}>
              <MaterialIconsIcon
                name="delete"
                color="white"
                size={25}
                style={styles.buttonTextStyle}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar animated={true} hidden={true} />

        <Text style={styles.CategoriesTextStyle}>Title</Text>

        <View style={styles.parentFlatlistViewStyle} />
        <TouchableWithoutFeedback onPress={() => isSetBorder(false)}>
          <View style={styles.flatlistViewStyle}>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={[{key: 'button'}, ...ListItems]}
              renderItem={({item, index}) =>
                index === 0
                  ? renderButton()
                  : renderItem({item: item as ListItem, index})
              }
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.list}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Modal animationType="slide" transparent={true} visible={isAddElement}>
        <TouchableWithoutFeedback onPress={handleModalFeedback}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View>
                  {image ? (
                    <View>
                      {image && (
                        <TouchableOpacity onPress={handleChoosePhoto}>
                          <Image
                            source={{uri: image}}
                            style={styles.imageUploadStyle}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleChoosePhoto}
                      style={styles.handleChoosePhotoStyle}>
                      <Icon
                        name="image"
                        color={'#19212699'}
                        size={40}
                        style={styles.uploadImgStyle}
                      />
                      <Text style={styles.uploadButtonStyle}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    handleFocusRef();
                  }}
                  style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInputContainer,
                  ]}>
                  <Text
                    style={[
                      styles.labelTextStyle,
                      isFocused && styles.focusedLabel,
                      title.length > 0 && styles.focusedLabel,
                    ]}>
                    title Name
                  </Text>
                  <TextInput
                    ref={inputRef}
                    value={title}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={settitle}
                    style={[
                      styles.inputStyleText,
                      isFocused && styles.focusedInput,
                      {backgroundColor: 'white'},
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    isAddElement
                      ? () => handleAddListItem()
                      : () => handleUpdateElement()
                  }
                  style={styles.saveNewCategoryButtonStyle}>
                  <View style={styles.saveNewCategoryViewStyle}>
                    <Text style={styles.saveNewCategoryTextStyle}>
                      {isAddElement && isEditElement === false ? (
                        <Text>savenewTitle</Text>
                      ) : (
                        <Text>UpdateTitile</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
export default Galerrycamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  CategoriesTextStyle: {
    marginTop: 30,
    color: '#192126',
    textAlign: 'center',
    fontFamily: 'Lato',
    fontSize: 4.5,
    paddingTop: Platform.OS === 'android' ? 10 : 20,
    fontWeight: Platform.OS === 'android' ? '700' : '600',
  },
  saveNewCategoryTextStyle: {
    backgroundColor: '#BBF246',
    color: '#192126',
    textAlign: 'center',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: 4,
    paddingVertical: 10,
  },
  saveNewCategoryViewStyle: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveNewCategoryButtonStyle: {
    width: '100%',
  },
  listItemGapStyle: {
    marginLeft: 20,
  },
  addButtonElement: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 10,
    borderColor: '#36CC55',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  ListItemViewStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemStyle: {
    flex: 1,
    height: '100%',
    marginRight: 40,
  },
  plusTextStyle: {
    fontFamily: 'Lato',
    fontWeight: '400',
    fontSize: 6.5,
    color: '#192126',
    lineHeight: 23,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  plusViewStyle: {
    fontFamily: 'Lato',
    fontWeight: '400',
    fontSize: 6,
    color: '#192126',
    lineHeight: 23,
    backgroundColor: '#36CC55',
    width: 50,
    height: 50,
    paddingVertical: 20,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20,
  },
  uploadButtonStyle: {
    padding: 20,
    color: '#19212699',
    marginLeft: 20,
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 4,
    textAlign: 'center',
  },
  selectedItemStyle: {
    width: '100%',
  },
  imageStyle: {
    marginTop: 20,
    width: '100%',
    height: 300,
    borderRadius: 50,
  },
  imageUploadStyle: {
    marginTop: 0,
    width: '100%',
    height: 200,
    borderRadius: 50,
    borderWidth: 60,
    borderColor: '#36CC55',
  },
  centeredView: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(25, 33, 38,0.3)',
    justifyContent: 'center',
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  handleChoosePhotoStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 30,
    borderColor: '#36CC55',
    borderRadius: 30,
  },
  uploadImgStyle: {
    width: 50,
    height: 60,
    alignSelf: 'center',
  },
  addNewStyle: {
    textAlign: 'center',
    backgroundColor: '#D4DAE3',
    paddingVertical: 30,
    marginTop: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    zIndex: -2,
    color: '#192126',
    fontFamily: 'Lato',
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    lineHeight: 40,
    fontSize: 3.5,
  },
  addNewViewStyle: {
    backgroundColor: '#D4DAE3',
    height: 40,
    width: '40%',
    paddingVertical: 20,
    marginTop: -20,
    marginHorizontal: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    zIndex: -2,
    lineHeight: 40,
    fontSize: 4,
  },
  titleStyle: {
    textAlign: 'center',
    backgroundColor: '#D4DAE3',
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
    zIndex: -2,
    color: '#192126',
    fontFamily: 'Lato',
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    lineHeight: 30,
    fontSize: 10,
  },
  titleViewStyle: {
    backgroundColor: '#D4DAE3',
    height: 30,
    width: 200,
    paddingVertical: 20,
    marginTop: -10,
    marginHorizontal: 15,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    zIndex: -2,
    lineHeight: 40,
    fontSize: 4,
  },
  editDeleteViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  buttonDeleteStyle: {
    backgroundColor: '#EB001BE0',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignSelf: 'center',
    width: 200,
    height: 100,
    marginHorizontal: 10,
  },
  buttonEditStyle: {
    backgroundColor: '#36CC55',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  buttonTextStyle: {
    width: 40,
    height: 20,
  },
  flatlistViewStyle: {
    backgroundColor: '#f7f8fc',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 10,
    marginTop: -30,
    flex: 1,
  },
  parentFlatlistViewStyle: {
    backgroundColor: '#e3e3e3',
    height: 50,
    width: 400,
    borderTopRightRadius: 200,
    borderTopLeftRadius: 300,
    marginTop: 20,
    marginHorizontal: 30,
    paddingHorizontal: 30,
  },
  list: {
    gap: 20,
    justifyContent: 'space-between',
  },

  inputContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'rgba(25, 33, 38, 0.4)',
    width: 350,
    height: 50,
    marginVertical: 20,
  },
  focusedInputContainer: {
    borderColor: 'rgba(25, 33, 38, 0.4)',
    borderWidth: 1,
    borderRadius: 20,
    width: 350,
    height: 100,
    marginVertical: 20,
  },
  labelTextStyle: {
    height: 50,
    top: 50,
    left: 50,
    fontSize: 4,
    fontFamily: 'Lato',
    color: 'rgba(25, 33, 38, 0.4)',
    backgroundColor: 'white',
    zIndex: 99,
    width: 300,
  },
  focusedLabel: {
    fontSize: 3.5,
    fontFamily: 'Lato',
    color: 'rgba(25, 33, 38, 0.4)',
    top: 10,
    left: 15,
    backgroundColor: 'white',
    zIndex: 99,
    width: 500,
  },
  inputStyleText: {
    width: 200,
    paddingHorizontal: 20,
    marginVertical: 0,
    fontSize: 4,
    fontWeight: '400',
    color: 'rgba(25, 33, 38, 1)',
    height: 50,
  },
  focusedInput: {
    height: 50,
    marginVertical: 0,
    fontFamily: 'Lato',
    fontWeight: '400',
    fontSize: 4,
    color: 'rgba(25, 33, 38, 1)',
  },
});
