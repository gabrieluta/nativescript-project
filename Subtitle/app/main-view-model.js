var Observable = require("tns-core-modules/data/observable").Observable;
var imagePicker = require("imagepicker-nativescript-plugin");

function createViewModel() {

    var viewModel = new Observable();
    viewModel.chooseImage = function() {

        let that = this;
        var context = imagePicker.create([{ mode: "single" }]);
        context
        .authorize()
        .then(function() {
            that.selectedImage = null;
            return context.present();
        })
        .then(function(selection) {
            console.log("Selection done: " + JSON.stringify(selection));  
            that.selectedImage = selection[0];

        })
        .catch(function (e) {
            console.log(e);
        });

        viewModel.pickedImage = this.selectedImage;
    }

    return viewModel;
}

exports.createViewModel = createViewModel;