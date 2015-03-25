﻿(function () {
    "use strict";


    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var itemRenderer;

    var RecordType = Object.freeze({
        campus: 1,
        campusone: 2,
        fun: 3,
        funone: 4,
    });

    ui.Pages.define("/pages/LifeOnCampus/LifeOnCampus.html", {
        // Navigates to the groupHeaderPage. Called from the groupHeaders,
        // keyboard shortcut and iteminvoked.
        navigateToGroup: function (key) {
            //nav.navigate("/pages/SpokePage/SpokePage.html", { groupKey: key });
        },


        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".groupeditemslist").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.oniteminvoked = this._itemInvoked.bind(this);

            // Set up a keyboard shortcut (ctrl + alt + g) to navigate to the
            // current group when not in snapped mode.
            listView.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);

            this._initializeLayout(listView, appView.value);
            listView.element.focus();
        },
        groupInfo: function () {
            return {
                enableCellSpanning: true,

                cellWidth: 1 + 11,
                cellHeight: 1 + 7

            };
        },
        computeItemSize: function (index) {
            var size = {
                width: 318,
                height: 455
            };

            if (index != null) {
                index = index + 1;
                if (typeof (index) === "number") {
                    if (CampusData.items._groupedItems[index] != undefined) {
                        if (CampusData.items._groupedItems[index].data.recordType === RecordType.campus) {
                            size.width = 318;
                            size.height = 455
                        }
                        else if (CampusData.items._groupedItems[index].data.recordType === RecordType.campusone) {
                            size.width = 318;
                            size.height = 455;
                        }
                        else if (CampusData.items._groupedItems[index].data.recordType === RecordType.fun) {
                            size.width = 480;
                            size.height = 217;
                        }
                        else if (CampusData.items._groupedItems[index].data.recordType === RecordType.funone) {
                            size.width = 480;
                            size.height = 217;
                        }

                    }
                }
            }
            return size;
        },
        renderItem: function (item, recycledElement) {
            var renderer = document.querySelector(".itemtemplate");
            if (item._value.data.recordType === RecordType.campus) {
                renderer = document.querySelector(".CampusBoxTemplate");
            }
            else if (item._value.data.recordType === RecordType.campusone) {
                renderer = document.querySelector(".CampusOneBoxTemplate");
            }
            else if (item._value.data.recordType === RecordType.fun) {
                renderer = document.querySelector(".FunBoxTemplate");
            }
            else if (item._value.data.recordType === RecordType.funone) {
                renderer = document.querySelector(".FunOneBoxTemplate");
            }

            if (renderer.renderItem != null)
                return renderer.renderItem.call(this, item, recycledElement);
            else
                return renderer;
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this._initializeLayout(listView, viewState);
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.itemDataSource = CampusData.groups.dataSource;
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemDataSource = CampusData.items.dataSource;
                listView.groupDataSource = CampusData.groups.dataSource;
                listView.itemTemplate = this.renderItem;
                listView.layout = new ui.GridLayout({
                    groupHeaderPosition: "top",
                    groupInfo: this.groupInfo,
                    itemInfo: this.computeItemSize
                });
            }
        },

        _itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = CampusData.groups.getAt(args.detail.itemIndex);
                this.navigateToGroup(group.key);
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = CampusData.items.getAt(args.detail.itemIndex);
                //nav.navigate("/pages/AboutUsPage/AboutUsPage.html", { item: Data.getItemReference(item) });
            }
        }
    });
})();
