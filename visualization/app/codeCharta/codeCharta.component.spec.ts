import {CodeChartaController} from "./codeCharta.component";

import {DataService} from "./core/data/data.service";
import {DialogService} from "./ui/dialog/dialog.service";
import {SettingsService} from "./core/settings/settings.service";
import {ScenarioService} from "./core/scenario/scenario.service";
import {ThreeOrbitControlsService} from "./ui/codeMap/threeViewer/threeOrbitControlsService";
import {DataLoadingService} from "./core/data/data.loading.service";
import {UrlService} from "./core/url/url.service";
import {IRootScopeService} from "angular";
import {NodeContextMenuComponent} from "./ui/nodeContextMenu/nodeContextMenu.component";

jest.mock("./core/data/data.service");
jest.mock("./ui/dialog/dialog.service");
jest.mock("./core/settings/settings.service");
jest.mock("./core/scenario/scenario.service");
jest.mock("./ui/codeMap/threeViewer/threeOrbitControlsService");
jest.mock("./core/data/data.loading.service");
jest.mock("./core/url/url.service");

describe("codecharta component", ()=>{
   
    let cc: CodeChartaController;
    let dataLoadingService: DataLoadingService;
    let urlService: UrlService;
    let settingsService: SettingsService;
    let scenarioService: ScenarioService;
    let dataService: DataService;
    let threeOrbitControlsService: ThreeOrbitControlsService;
    let $mdSidenav: any;
    let $rootScope: any;
    let dialogService: DialogService;

    let tmpEventListener;

    beforeEach(()=>{
        tmpEventListener = document.body.addEventListener;
        document.body.addEventListener = jest.fn();

        dataLoadingService = new DataLoadingService();
        urlService = new UrlService();
        urlService.getFileDataFromQueryParam = jest.fn(() => Promise.resolve({}));
        settingsService = new SettingsService();
        scenarioService = new ScenarioService();
        dataService = new DataService();
        threeOrbitControlsService = new ThreeOrbitControlsService();
        $mdSidenav = jest.fn();
        $rootScope = {
            $on: jest.fn()
        };
        dialogService = new DialogService();
        cc = new CodeChartaController(
            dataLoadingService,
            urlService,
            settingsService,
            scenarioService,
            dataService,
            threeOrbitControlsService,
            $mdSidenav,
            $rootScope,
            dialogService
        );
    });

    afterEach(()=>{
        document.body.addEventListener = tmpEventListener;
    });

    describe("#trySettingGivenData",()=>{

        it("should try to load file with the correct indices",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.trySettingGivenData("a", {});
            expect(dataLoadingService.loadMapFromFileContent).toHaveBeenCalledWith("a", expect.anything(), 0);
        });

        it("should apply scenario ONCE when map is loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.trySettingGivenData("a", {});
            expect(scenarioService.applyScenarioOnce).toHaveBeenCalled();
        });

        it("should update settings by url params when map is loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.trySettingGivenData("a", {});
            expect(settingsService.updateSettingsFromUrl).toHaveBeenCalled();
        });

        it("should decrement loading tasks when map is loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            cc.viewModel.numberOfLoadingTasks = 99;
            await cc.trySettingGivenData("a", {});
            expect(cc.viewModel.numberOfLoadingTasks).toBe(98);
        });

        it("should print errors when map is loaded",async ()=>{
            cc.printErrors = jest.fn();
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.reject());
            await cc.trySettingGivenData("a", {});
            expect(cc.printErrors).toHaveBeenCalled();
        });

        it("should decrement loading tasks when sample map is not loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.reject());
            cc.viewModel.numberOfLoadingTasks = 99;
            await cc.trySettingGivenData("a", {});
            expect(cc.viewModel.numberOfLoadingTasks).toBe(98);
        });

        it("should set maps correctly when map is loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.trySettingGivenData("a", {});
            expect(dataService.setComparisonMap).toHaveBeenCalledWith(0);
            expect(dataService.setReferenceMap).toHaveBeenCalledWith(0);
        });
    });

    describe("#tryLoadingSampleData",()=>{

        it("should try to load both sample files with the correct indices",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.tryLoadingSampleFiles();
            expect(dataLoadingService.loadMapFromFileContent).toHaveBeenCalledWith("sample1.json", expect.anything(), 0);
            expect(dataLoadingService.loadMapFromFileContent).toHaveBeenCalledWith("sample2.json", expect.anything(), 1);
        });

        it("should apply scenario when sample maps are loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.tryLoadingSampleFiles();
            expect(scenarioService.applyScenario).toHaveBeenCalled();
        });

        it("should update settings by url params when sample maps are loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.tryLoadingSampleFiles();
            expect(settingsService.updateSettingsFromUrl).toHaveBeenCalled();
        });

        it("should decrement loading tasks when sample maps are loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            cc.viewModel.numberOfLoadingTasks = 99;
            await cc.tryLoadingSampleFiles();
            expect(cc.viewModel.numberOfLoadingTasks).toBe(98);
        });

        it("should print errors when sample maps are not loaded",async ()=>{
            cc.printErrors = jest.fn();
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.reject());
            await cc.tryLoadingSampleFiles();
            expect(cc.printErrors).toHaveBeenCalled();
        });

        it("should decrement loading tasks when sample maps are not loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.reject());
            cc.viewModel.numberOfLoadingTasks = 99;
            await cc.tryLoadingSampleFiles();
            expect(cc.viewModel.numberOfLoadingTasks).toBe(98);
        });

        it("should set maps correctly when sample maps are loaded",async ()=>{
            dataLoadingService.loadMapFromFileContent = jest.fn(() => Promise.resolve());
            await cc.tryLoadingSampleFiles();
            expect(dataService.setComparisonMap).toHaveBeenCalledWith(0);
            expect(dataService.setReferenceMap).toHaveBeenCalledWith(0);
        });

    });

    describe("#loadFileOrSample",()=>{

        it("should show error dialog when url param is valid and maps cannot be loaded",async ()=>{
            cc.tryLoadingSampleFiles = jest.fn();
            cc.trySettingGivenData = jest.fn();
            urlService.getParam = jest.fn(()=>"some file that should have been loaded");
            urlService.getFileDataFromQueryParam = jest.fn(() => Promise.reject());
            await cc.loadFileOrSample();
            expect(dialogService.showErrorDialog).toHaveBeenCalled();
        });

        it("should load sample with no warning if file parameter is not set and therefore no valid data exists",async ()=>{
            cc.tryLoadingSampleFiles = jest.fn();
            cc.trySettingGivenData = jest.fn();
            urlService.getParam = jest.fn(()=>null);
            urlService.getFileDataFromQueryParam = jest.fn(() => Promise.reject());
            await cc.loadFileOrSample();
            expect(cc.tryLoadingSampleFiles).toHaveBeenCalled();
            expect(dialogService.showErrorDialog).not.toHaveBeenCalled();
            expect(cc.trySettingGivenData).not.toHaveBeenCalled();
        });

        it("should try setting given data if file in url is valid",async ()=>{
            cc.trySettingGivenData = jest.fn();
            urlService.getFileDataFromQueryParam = jest.fn(() => Promise.resolve("SOME_DATA"));
            await cc.loadFileOrSample();
            expect(cc.trySettingGivenData).toHaveBeenCalled();
        });

        it("should increase number of loading tasks",async ()=>{
            cc.viewModel.numberOfLoadingTasks = 0;
            dataLoadingService.loadMapFromFileContent = jest.fn(() => {
                expect(cc.viewModel.numberOfLoadingTasks).toBe(1);
                return Promise.resolve();
            });
            await cc.loadFileOrSample();
            expect(cc.viewModel.numberOfLoadingTasks).toBe(0);
        });

    });

    it("should add click listener in order to hide context menu",()=>{
        expect(document.body.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), expect.anything());
        let oldHide = NodeContextMenuComponent.hide;
        NodeContextMenuComponent.hide = jest.fn();
        (document.body.addEventListener as any).mock.calls[0][1]();
        expect(NodeContextMenuComponent.hide).toHaveBeenCalledWith($rootScope);
        NodeContextMenuComponent.hide = oldHide;
    });

    it("should subscribe to loading events and update view model correctly",()=>{
        expect($rootScope.$on).toHaveBeenCalledWith("add-loading-task", expect.any(Function));
        expect($rootScope.$on).toHaveBeenCalledWith("remove-loading-task", expect.any(Function));
        cc.viewModel.numberOfLoadingTasks = 0;
        $rootScope.$on.mock.calls[0][1]();
        expect(cc.viewModel.numberOfLoadingTasks).toBe(1);
        $rootScope.$on.mock.calls[1][1]();
        expect(cc.viewModel.numberOfLoadingTasks).toBe(0);
    });

    it("should auto fit camera when fitting scene",()=>{
       cc.fitMapToView();
       expect(threeOrbitControlsService.autoFitTo).toHaveBeenCalled();
    });

    it("should call error dialog on errors",()=>{
       cc.printErrors({});
       expect(dialogService.showErrorDialog).toHaveBeenCalled();
    });

    it("should show url params",()=>{
       cc.showUrlParams();
       expect(dialogService.showQueryParamDialog).toHaveBeenCalled();
    });

});