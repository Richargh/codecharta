"use strict";

class ScenarioButtonsController {

    /* @ngInject */
    constructor(scenarioService) {


        /**
         *
         * @type {ScenarioService}
         */
        this.scenarioService = scenarioService;

        this.scenarios = scenarioService.getScenarios();

    }

}

export {ScenarioButtonsController};


