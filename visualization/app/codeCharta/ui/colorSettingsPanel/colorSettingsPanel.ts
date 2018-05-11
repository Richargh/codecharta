import "../rangeSlider/rangeSlider";
import "../resetSettingsButton/resetSettingsButton";
import "../../core/core.module";
import "script-loader!tinycolor2";
import "script-loader!md-color-picker";
import "md-color-picker/dist/mdColorPicker.css";

import angular from "angular";

import {colorSettingsPanelComponent} from "./colorSettingsPanel.component";

angular.module("app.codeCharta.ui.colorSettingsPanel", ["app.codeCharta.ui.rangeSlider", "app.codeCharta.ui.resetSettingsButton", "app.codeCharta.core", "mdColorPicker"])
    .component(colorSettingsPanelComponent.selector, colorSettingsPanelComponent);


