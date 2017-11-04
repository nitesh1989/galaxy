/** Dataset edit attributes view */
import Utils from "utils/utils";
import Tabs from "mvc/ui/ui-tabs";
import Ui from "mvc/ui/ui-misc";
import Form from "mvc/form/form-view";
var View = Backbone.View.extend({
    initialize: function() {
        this.setElement("<div/>");
        this.model = new Backbone.Model({
            dataset_id: Galaxy.params.dataset_id
        });
        this.message = new Ui.Message({ persistent: true });
        this.tabs = this._createTabs();
        this.$el
            .append($("<h4/>").append("Edit dataset attributes"))
            .append(this.message.$el)
            .append("<p/>")
            .append(this.tabs.$el)
            .hide();
        this.render();
    },

    /** fetch data for the selected dataset and build forms */
    render: function() {
        var self = this;
        $.ajax({
            url: `${Galaxy.root}dataset/get_edit?dataset_id=${self.model.get("dataset_id")}`,
            success: function(response) {
                !self.initial_message && self.message.update(response);
                self.initial_message = true;
                _.each(self.forms, (form, key) => {
                    form.model.set("inputs", response[`${key}_inputs`]);
                    form.model.set("hide_operations", response[`${key}_disable`]);
                    form.render();
                });
                self.$el.show();
            },
            error: function(response) {
                var err_msg = response.responseJSON && response.responseJSON.err_msg;
                self.message.update({
                    status: "danger",
                    message: err_msg || "Error occured while loading the dataset."
                });
            }
        });
    },

    /** submit data to backend to update attributes */
    _submit: function(operation, form) {
        var self = this;
        var data = form.data.create();
        data.dataset_id = this.model.get("dataset_id");
        data.operation = operation;
        $.ajax({
            type: "PUT",
            url: `${Galaxy.root}dataset/set_edit`,
            data: data,
            success: function(response) {
                self.message.update(response);
                self.render();
                self._reloadHistory();
            },
            error: function(response) {
                var err_msg = response.responseJSON && response.responseJSON.err_msg;
                self.message.update({
                    status: "danger",
                    message: err_msg || "Error occured while editing the dataset attributes."
                });
            }
        });
    },

    /** create tabs for different dataset attribute categories*/
    _createTabs: function() {
        this.forms = {
            attribute: this._getAttribute(),
            conversion: this._getConversion(),
            datatype: this._getDatatype(),
            permission: this._getPermission()
        };
        var tabs = new Tabs.View();
        tabs.add({
            id: "attribute",
            title: "Attributes",
            icon: "fa fa-bars",
            tooltip: "Edit dataset attributes",
            $el: this.forms.attribute.$el
        });
        tabs.add({
            id: "convert",
            title: "Convert",
            icon: "fa-gear",
            tooltip: "Convert to new format",
            $el: this.forms.conversion.$el
        });
        tabs.add({
            id: "datatype",
            title: "Datatypes",
            icon: "fa-database",
            tooltip: "Change data type",
            $el: this.forms.datatype.$el
        });
        tabs.add({
            id: "permissions",
            title: "Permissions",
            icon: "fa-user",
            tooltip: "Permissions",
            $el: this.forms.permission.$el
        });
        return tabs;
    },

    /** edit main attributes form */
    _getAttribute: function() {
        var self = this;
        var form = new Form({
            title: "Edit attributes",
            operations: {
                submit_attributes: new Ui.ButtonIcon({
                    tooltip: "Save attributes of the dataset.",
                    icon: "fa-floppy-o",
                    title: "Save",
                    onclick: function() {
                        self._submit("attributes", form);
                    }
                }),
                submit_autodetect: new Ui.ButtonIcon({
                    tooltip:
                        "This will inspect the dataset and attempt to correct the values of fields if they are not accurate.",
                    icon: "fa-undo",
                    title: "Auto-detect",
                    onclick: function() {
                        self._submit("autodetect", form);
                    }
                })
            }
        });
        return form;
    },

    /** datatype conversion form */
    _getConversion: function() {
        var self = this;
        var form = new Form({
            title: "Convert to new format",
            operations: {
                submit_conversion: new Ui.ButtonIcon({
                    tooltip: "Convert the datatype to a new format.",
                    title: "Convert datatype",
                    icon: "fa-exchange",
                    onclick: function() {
                        self._submit("conversion", form);
                    }
                })
            }
        });
        return form;
    },

    /** change datatype form */
    _getDatatype: function() {
        var self = this;
        var form = new Form({
            title: "Change datatype",
            operations: {
                submit_datatype: new Ui.ButtonIcon({
                    tooltip: "Change the datatype to a new type.",
                    title: "Change datatype",
                    icon: "fa-exchange",
                    onclick: function() {
                        self._submit("datatype", form);
                    }
                })
            }
        });
        return form;
    },

    /** dataset permissions form */
    _getPermission: function() {
        var self = this;
        var form = new Form({
            title: "Manage dataset permissions",
            operations: {
                submit_permission: new Ui.ButtonIcon({
                    tooltip: "Save permissions.",
                    title: "Save permissions",
                    icon: "fa-floppy-o ",
                    onclick: function() {
                        self._submit("permission", form);
                    }
                })
            }
        });
        return form;
    },

    /** reload Galaxy's history after updating dataset's attributes */
    _reloadHistory: function() {
        if (window.Galaxy) {
            window.Galaxy.currHistoryPanel.loadCurrentHistory();
        }
    }
});

export default {
    View: View
};
