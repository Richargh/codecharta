import {CodeMapNode, Edge} from "../../core/data/model/CodeMap";
import {hierarchy} from "d3-hierarchy";
import {SettingsService} from "../../core/settings/settings.service";
import {ThreeOrbitControlsService} from "./threeViewer/threeOrbitControlsService";

export class CodeMapActionsService {

    public static SELECTOR = "codeMapActionsService";

    constructor(
        private settingsService: SettingsService,
        private threeOrbitControlsService: ThreeOrbitControlsService,
        private $timeout
    ) {

    }

    toggleNodeVisibility(node: CodeMapNode) {
        if(node.visible){
            this.hideNode(node);
        } else {
            this.showNode(node);
        }
    }

    hideNode(node: CodeMapNode) {
        this.setVisibilityOfNodeAndDescendants(node, false);
        this.apply();
    }

    showNode(node: CodeMapNode) {
        this.setVisibilityOfNodeAndDescendants(node, true);
        this.apply();
    }

    markFolder(node: CodeMapNode, color: string) {
        let startingColor = node.markingColor;
        let recFn = (current: CodeMapNode)=>{
            if(!current.markingColor || current.markingColor === startingColor) {
                current.markingColor = "0x" + color.substr(1);
                if(current.children){
                    current.children.forEach(recFn);
                }
            }
        };
        recFn(node);
        this.apply();
    }

    unmarkFolder(node: CodeMapNode) {
        let startingColor = node.markingColor;
        let recFn = (current: CodeMapNode)=>{
            if(current.markingColor === startingColor) {
                current.markingColor = null;
                if(current.children){
                    current.children.forEach(recFn);
                }
            }
        };
        recFn(node);
        this.apply();
    }

    isolateNode(node: CodeMapNode) {
        this.setVisibilityOfNodeAndDescendants(this.settingsService.settings.map.root, false);
        this.setVisibilityOfNodeAndDescendants(node, true);
        this.autoFit();
        this.apply();
    }

    showAllNodes() {
        this.setVisibilityOfNodeAndDescendants(this.settingsService.settings.map.root, true);
        this.autoFit();
        this.apply();
    }

    showDependentEdges(node: CodeMapNode) {
        if (this.settingsService.settings.map.edges) {
            this.settingsService.settings.map.edges.forEach((edge) => {
                if (this.edgeContainsNode(edge, node)) {
                    edge.visible = true;
                }
            });
            this.apply();
        }
    }

    hideDependentEdges(node: CodeMapNode) {
        if (this.settingsService.settings.map.edges) {
            this.settingsService.settings.map.edges.forEach((edge) => {
                if (this.edgeContainsNode(edge, node)) {
                    edge.visible = false;
                }
            });
            this.apply();
        }
    }

    hideAllEdges() {
        if (this.settingsService.settings.map.edges) {
            this.settingsService.settings.map.edges.forEach((edge) => {
                edge.visible = false;
            });
            this.apply();
        }
    }

    nodeHasEdges(node: CodeMapNode) {
        let nodeHasEdges = false;
        this.settingsService.settings.map.edges.forEach((edge) => {
            if(this.edgeContainsNode(edge, node)) {
                nodeHasEdges = true;
                return; // break forEach
            }
        });
        return nodeHasEdges;
    }

    allDependentEdgesAreVisible(node: CodeMapNode) {
        let allDependentEdgesAreVisible = true;
        this.settingsService.settings.map.edges.forEach((edge) => {
            if(!edge.visible && this.edgeContainsNode(edge, node)) {
                allDependentEdgesAreVisible = false;
                return; // break forEach
            }
        });
        return allDependentEdgesAreVisible;
    }

    anyEdgeIsVisible() {
        let anyEdgeIsVisible = false;
        this.settingsService.settings.map.edges.forEach((edge) => {
            if(edge.visible) {
                anyEdgeIsVisible = true;
                return; // break forEach
            }
        });
        return anyEdgeIsVisible;
    }

    private edgeContainsNode(edge: Edge, node: CodeMapNode) {
        return (node.path == edge.fromNodeName || node.path == edge.toNodeName);
    }

    private apply() {
        this.$timeout(() => {
            this.settingsService.onSettingsChanged();
        }, 50);
    }

    private autoFit() {
        this.$timeout(() => {
            this.threeOrbitControlsService.autoFitTo();
        }, 250);
    }

    private setVisibilityOfNodeAndDescendants(node: CodeMapNode, visibility: boolean) {
        node.visible = visibility;
        hierarchy<CodeMapNode>(node).descendants().forEach((hierarchyNode) => {
            hierarchyNode.data.visible = visibility;
        });
    }

}