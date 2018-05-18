import {Settings, SettingsService, SettingsServiceSubscriber} from "../../core/settings/settings.service";
import "./colorSettingsPanel.component.scss";

export class ColorSettingsPanelController implements SettingsServiceSubscriber{

    public viewModel = {
        flipped: false,
        deltas: false,
        deltaColorFlipped: false,
        availableColors: {
            first: 0,
            second: 0,
            third: 0
        }
    };
    public colorPicker = 0;
    public colorPickerOptions= {
    };

    /* @ngInject */
    constructor(
        private settingsService: SettingsService
    ) {
        this.onSettingsChanged(this.settingsService.settings, null);
        this.settingsService.subscribe(this);
    }

    onSettingsChanged(settings: Settings, event) {
        this.viewModel.flipped = settings.neutralColorRange.flipped;
        this.viewModel.deltas = settings.deltas;
        this.viewModel.deltaColorFlipped = settings.deltaColorFlipped;
        this.viewModel.availableColors = settings.availableColors;


    }

    apply() {
        this.settingsService.settings.neutralColorRange.flipped = this.viewModel.flipped;
        this.settingsService.settings.deltaColorFlipped = this.viewModel.deltaColorFlipped;
        //var temp = this.colorPicker.toString().substring(1);
        var temp = parseInt(this.colorPicker.toString().substring(1), 16);
        this.settingsService.settings.availableColors.first = temp;
        this.settingsService.applySettings();
    }

}

export const colorSettingsPanelComponent = {
    selector: "colorSettingsPanelComponent",
    template: require("./colorSettingsPanel.component.html"),
    controller: ColorSettingsPanelController
};



