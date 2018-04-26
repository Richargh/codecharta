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
        },
        test: 0;
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
        var x = Number(this.viewModel.test);
        this.settingsService.settings.neutralColorRange.flipped = this.viewModel.flipped;
        this.settingsService.settings.deltaColorFlipped = this.viewModel.deltaColorFlipped;
        this.settingsService.settings.availableColors.first = this.viewModel.test;
        console.log(this.viewModel.test);
        this.settingsService.applySettings();
    }

}

export const colorSettingsPanelComponent = {
    selector: "colorSettingsPanelComponent",
    template: require("./colorSettingsPanel.component.html"),
    controller: ColorSettingsPanelController
};



