var data_observable = require('tns-core-modules/data/observable');
var imageAssetModule = require('tns-core-modules/image-asset');

const defaultAssetCollectionSubtypes = [
  PHAssetCollectionSubtype.SmartAlbumRecentlyAdded,
  PHAssetCollectionSubtype.SmartAlbumUserLibrary,
  PHAssetCollectionSubtype.AlbumMyPhotoStream,
  PHAssetCollectionSubtype.SmartAlbumFavorites,
  PHAssetCollectionSubtype.SmartAlbumPanoramas,
  PHAssetCollectionSubtype.SmartAlbumBursts,
  PHAssetCollectionSubtype.AlbumCloudShared,
  PHAssetCollectionSubtype.SmartAlbumSelfPortraits,
  PHAssetCollectionSubtype.SmartAlbumScreenshots,
  PHAssetCollectionSubtype.SmartAlbumLivePhotos
];

class ImagePickerControllerDelegate extends NSObject {

  qb_imagePickerControllerDidCancel(imagePickerController) {
      imagePickerController.dismissViewControllerAnimatedCompletion(true, null);
      this._reject(new Error("Selection canceled."));
  }

  qb_imagePickerControllerDidFinishPickingAssets(imagePickerController, iosAssets) {
      let assets = [];

      for (let i = 0; i < iosAssets.count; i++) {
          let asset = new imageAssetModule.ImageAsset(iosAssets[i]);

          if (!asset.options) {
              asset.options = { keepAspectRatio: true };
          }

          assets.push(asset);
      }

      this._resolve(assets);

      imagePickerController.dismissViewControllerAnimatedCompletion(true, null);
  }
  
  static new() {
      return super.new();
  }
}


class ImagePicker extends data_observable.Observable {

  get hostView() {
      return this._hostView;
  }

  get hostController() {
      return this.hostView ? this.hostView.viewController : UIApplication.sharedApplication.keyWindow.rootViewController;
  }
    
  constructor(options, hostView) {
    super();

    this._hostView = hostView;
    this._imagePickerControllerDelegate = new ImagePickerControllerDelegate();

    let imagePickerController = QBImagePickerController.alloc().init();
    imagePickerController.assetCollectionSubtypes = defaultAssetCollectionSubtypes;
    imagePickerController.mediaType = options.mediaType ? QBImagePickerMediaType(options.mediaType.valueOf()) : QBImagePickerMediaType.Any;
    imagePickerController.delegate = this._imagePickerControllerDelegate;
    imagePickerController.allowsMultipleSelection = options.mode === 'multiple';
    imagePickerController.minimumNumberOfSelection = options.minimumNumberOfSelection || 0;
    imagePickerController.maximumNumberOfSelection = options.maximumNumberOfSelection || 0;
    imagePickerController.showsNumberOfSelectedAssets = options.showsNumberOfSelectedAssets || true;
    imagePickerController.numberOfColumnsInPortrait = options.numberOfColumnsInPortrait || imagePickerController.numberOfColumnsInPortrait;
    imagePickerController.numberOfColumnsInLandscape = options.numberOfColumnsInLandscape || imagePickerController.numberOfColumnsInLandscape;
    imagePickerController.prompt = options.prompt || imagePickerController.prompt;

    this._imagePickerController = imagePickerController;

  }

  authorize() {

    console.log("authorizing...");

    return new Promise(function(resolve, reject) {

        PHPhotoLibrary.requestAuthorization(function (result) {
            if (result === PHAuthorizationStatus.Authorized) {
                resolve();
            } else {
                reject(new Error("Authorization failed. Status: " + result));
            }
        });
    });
  }

  present() {
    return new Promise(function(resolve, reject) {
        this._imagePickerControllerDelegate._resolve = resolve;
        this._imagePickerControllerDelegate._reject = reject;

        this.hostController.presentViewControllerAnimatedCompletion(this._imagePickerController, true, null);
    });
  }

}

function create(options, hostView) {
  return new ImagePicker(options, hostView);
}

module.exports = { 
    ImagePickerControllerDelegate: "ImagePickerControllerDelegate",
    ImagePicker: "ImagePicker",
    create: "create"
 };