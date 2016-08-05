$.ajaxSetup({
    // Disable caching of AJAX responses
    cache: false
});
//public method
function sysCoreMapArguments(args, properties) {
    var argn = Math.min(args.length, properties.length);
    var options = {};
    for (var i = 0; i < argn; i++) {
        options[properties[i]] = args[i];
    }
    return options;
}



//sysCore
sysCore = (function () {
    return {};
})();

/*
module:bootstrap 
reference:bootbox
*/
sysCore.bootstrap = (function () {
    var templates = {
        alert:
		  "<div sc-msg='Y' class='alert alert-danger text-center' style='position: fixed; z-index: 999999;display:none;top:0 ;width:100%''>" +
			" <a href='#' class='close' data-dismiss='alert'>&times;</a>" +
			  "<strong><span class='fa fa-warning'></span> Warning!</strong><p id='ntxAlertMessage'></p>" +
				"</div>",
        success: "<div sc-msg='Y' class='alert alert-success text-center' style='position: fixed; z-index:999999;display:none;top:0 ;width:100%'>" +
			" <a href='#' class='close' data-dismiss='alert'>&times;</a>" +
			  "<strong><span class='fa fa-check-circle'></span> Success </strong><span id='ntxAlertMessage'></span>" +
				"</div>", 
        progressbar: "<div class='sysCoreLoading'><span>Processing.....</span>" +
    "<div class='progress progress-striped active'>" +
        "<div class='progress-bar' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'></div></div></div>",
        dialog:
       "<div class='bootbox modal modal-default' tabindex='-1' role='dialog'>" +
         "<div class='modal-dialog'>" +
           "<div class='modal-content'>" + 
             "<div class='modal-body'><div class='bootbox-body' style='min-height:150px'></div></div>" +
           "</div>" +  
         "</div>" +    
       "</div>",  
        header:  
          "<div class='modal-header'>" +
            "<h4 class='modal-title'></h4>" + 
          "</div>",
        footer:
          "<div class='modal-footer'></div>",
        closeButton:
          "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
        form:
          "<form class='bootbox-form'></form>",
        inputs: {
            text:
              "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
            textarea:
              "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
            email:
              "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
            select:
              "<select class='bootbox-input bootbox-input-select form-control'></select>",
            checkbox:
              "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
            date:
              "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
            time:
              "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
            number:
              "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
            password:
              "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
        }
    };
    function errorAlert() {
        $("[sc-msg=Y]").remove();
        var options = sysCoreMapArguments(arguments, ["message", "callback"]);
        var alertObj = $(templates.alert);
        //if ($(".modal-header").length > 0) {
        //    $(".modal-header").prepend(alertObj);
        //    alertObj.css("position", "fixed")
        //}
        //else
        //    $("header").append(alertObj);
        $("body").append(alertObj);
        $("#ntxAlertMessage").html(options.message);
        $('.alert').fadeIn(300);
        $(".alert").on("closed.bs.alert", function () {
            if (options.callback)
                options.callback();
        });
    };
    function success() {
        $("[sc-msg=Y]").remove();
        var options = sysCoreMapArguments(arguments, ["message", "callback"]);
        var alertObj = $(templates.success);
        $("body").append(alertObj);
        $("#ntxAlertMessage").html(options.message);
        $('.alert').fadeIn(300).fadeOut(6000);
        $(".alert").on("closed.bs.alert", function () {
            if (options.callback)
                options.callback();
        });
    };
    function progress(open) {
        progressWithDelay(open, 300);
    };

    function progressWithDelay(open, delay) {
        if (open) {
            if ($("#loader-wrapper").length > 0)//20141007 avoid duplicate
                return;
            // var obj = $("<div style='display:none' id='loader-wrapper'><div  id='loader'></div></div>");
            var obj = $("<div id='loader-wrapper' style='display:none' ><div class='loader-spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div></div>");
            $("#bodyContent").append(obj);
            if (delay && delay >= 0) {
                setTimeout(function () { $("#loader-wrapper").css("display", "block"); }, delay);
            }
            else
                $("#loader-wrapper").css("display", "block");


        }
        else {
            $("#loader-wrapper").remove();
        }

    };

    //for小區塊使用
    function progressBlock(open, targetObj) {
        var blockId = new Date().getTime();
        if (open) {
            if ($(targetObj).find("[sc-blockId]").length > 0)//20141007 avoid duplicate
                return;
            var obj = $("<div style='display:none' sc-pg-block class='loader-spinner' sc-blockId='" + blockId + "'><div class='double-bounce1'></div><div class='double-bounce2'></div></div>");
            $(targetObj).append(obj);
            setTimeout(function () { $("[sc-blockId=" + blockId + "]").css("display", "block"); }, 300);
        }
        else {
            $(targetObj).find("[sc-blockId]").remove();
        }
        return blockId;
    };

    //=====
    var defaults = {
        // default language
        locale: "en",
        // show backdrop or not
        backdrop: true,
        // animate the modal in/out
        animate: true,
        // additional class string applied to the top level dialog
        className: null,
        // whether or not to include a close button
        closeButton: true,
        // show the dialog immediately by default
        show: true,
        // dialog container
        container: "body"
    };

    // our public object; augmented after our private API
    var exports = {};

    /**
     * @private
     */
    function _t(key) {
        var locale = locales[defaults.locale];
        return locale ? locale[key] : locales.en[key];
    }

    function processCallback(e, dialog, callback) {
        e.stopPropagation();
        e.preventDefault();

        var preserveDialog = $.isFunction(callback) && callback(e) === false;

        // ... otherwise we'll bin it
        if (!preserveDialog) {
            dialog.modal("hide");
        }
    }

    function getKeyLength(obj) {
        var k, t = 0;
        for (k in obj) {
            t++;
        }
        return t;
    }

    function each(collection, iterator) {
        var index = 0;
        $.each(collection, function (key, value) {
            iterator(key, value, index++);
        });
    }

    function sanitize(options) {
        var buttons;
        var total;

        if (typeof options !== "object") {
            throw new Error("Please supply an object of options");
        }

        if (!options.remoteUrl && !options.message) {
            throw new Error("Please specify a message");
        }

        // make sure any supplied options take precedence over defaults
        options = $.extend({}, defaults, options);

        if (!options.buttons) {
            options.buttons = {};
        }

        // we only support Bootstrap's "static" and false backdrop args
        // supporting true would mean you could dismiss the dialog without
        // explicitly interacting with it
        //  options.backdrop = options.backdrop ? "static" : false;
        options.backdrop = !options.backdrop ? "static" : true;//20150310:false設為static才為灰背景及不可點背景關閉

        buttons = options.buttons;

        total = getKeyLength(buttons);

        each(buttons, function (key, button, index) {

            if ($.isFunction(button)) {
                // short form, assume value is our callback. Since button
                // isn't an object it isn't a reference either so re-assign it
                button = buttons[key] = {
                    callback: button
                };
            }

            // before any further checks make sure by now button is the correct type
            if ($.type(button) !== "object") {
                throw new Error("button with key " + key + " must be an object");
            }

            if (!button.label) {
                // the lack of an explicit label means we'll assume the key is good enough
                button.label = key;
            }

            if (!button.className) {
                if (total <= 2 && index === total - 1) {
                    // always add a primary to the main option in a two-button dialog
                    button.className = "btn-warning";
                } else {
                    button.className = "btn-default";
                }
            }
        });

        return options;
    }

    function mapArguments(args, properties) {
        var argn = args.length;
        var options = {};

        if (argn < 1 || argn > 2) {
            throw new Error("Invalid argument length");
        }

        if (argn === 2 || typeof args[0] === "string") {
            options[properties[0]] = args[0];
            options[properties[1]] = args[1];
        } else {
            options = args[0];
        }

        return options;
    }

    function mergeArguments(defaults, args, properties) {
        return $.extend(
          // deep merge
          true,
          // ensure the target is an empty, unreferenced object
          {},
          // the base options object for this type of dialog (often just buttons)
          defaults,
          // args could be an object or array; if it's an array properties will
          // map it to a proper options object
         // mapArguments(args,properties ) 2014/06/22 chage to as below
         sysCoreMapArguments(args, properties)
        );
    }

    function mergeDialogOptions(className, labels, properties, args) {
        //  build up a base set of dialog properties
        var baseOptions = {
            className: "bootbox-" + className,
            buttons: createLabels.apply(null, labels)
        };

        // ensure the buttons properties generated, *after* merging
        // with user args are still valid against the supplied labels
        return validateButtons(
          // merge the generated base properties with user supplied arguments
          mergeArguments(
            baseOptions,
            args,
            // if args.length > 1, properties specify how each arg maps to an object key
            properties
          ),
          labels
        );
    }

    function createLabels() {
        var buttons = {};

        for (var i = 0, j = arguments.length; i < j; i++) {
            var argument = arguments[i];
            var key = argument.toLowerCase();
            var value = argument.toUpperCase();

            buttons[key] = {
                label: _t(value)
            };
        }

        return buttons;
    }

    function validateButtons(options, buttons) {
        var allowedButtons = {};
        each(buttons, function (key, value) {
            allowedButtons[value] = true;
        });

        each(options.buttons, function (key) {
            if (allowedButtons[key] === undefined) {
                throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
            }
        });

        return options;
    }

    exports.alert = function () {
        var options;
        options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);
        options.title = "Alert!";
        options.zIndex = 9999999;
        if (options.callback && !$.isFunction(options.callback)) {
            throw new Error("alert requires callback property to be a function when provided");
        }

        /**
         * overrides
         */
        options.buttons.ok.callback = options.onEscape = function () {
            if ($.isFunction(options.callback)) {
                return options.callback();
            }
            return true;
        };

        return exports.dialog(options);
    };

    exports.confirm = function () {
        var options;
        if (arguments.length == 3)
            options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "title", "callback"], arguments);
        else {
            options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "callback"], arguments);
            options.title = "Warn!";
        }
        /**
         * overrides; undo anything the user tried to set they shouldn't have
         */
        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback(false);
        };

        options.buttons.confirm.callback = function () {
            return options.callback(true);
        };

        // confirm specific validation
        if (!$.isFunction(options.callback)) {
            throw new Error("confirm requires a callback");
        }

        return exports.dialog(options);
    };

    exports.prompt = function () {
        var options;
        var defaults;
        var dialog;
        var form;
        var input;
        var shouldShow;
        var inputOptions;

        form = $(templates.form);


        defaults = {
            className: "bootbox-prompt",
            buttons: createLabels("cancel", "confirm"),
            value: "",
            inputType: "text"
        };

        options = validateButtons(
          mergeArguments(defaults, arguments, ["title", "callback"]),
          ["cancel", "confirm"]
        );

        // capture the user's show value; we always set this to false before
        // spawning the dialog to give us a chance to attach some handlers to
        // it, but we need to make sure we respect a preference not to show it
        shouldShow = (options.show === undefined) ? true : options.show;

        // check if the browser supports the option.inputType
        var html5inputs = ["date", "time", "number"];
        var i = document.createElement("input");
        i.setAttribute("type", options.inputType);
        if (html5inputs[options.inputType]) {
            options.inputType = i.type;
        }

        /**
         * overrides; undo anything the user tried to set they shouldn't have
         */
        options.message = form;

        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback(null);
        };

        options.buttons.confirm.callback = function () {
            var value;

            switch (options.inputType) {
                case "text":
                case "textarea":
                case "email":
                case "select":
                case "date":
                case "time":
                case "number":
                case "password":
                    value = input.val();
                    break;

                case "checkbox":
                    var checkedItems = input.find("input:checked");

                    // we assume that checkboxes are always multiple,
                    // hence we default to an empty array
                    value = [];

                    each(checkedItems, function (_, item) {
                        value.push($(item).val());
                    });
                    break;
            }

            return options.callback(value);
        };

        options.show = false;

        // prompt specific validation
        if (!options.title) {
            throw new Error("prompt requires a title");
        }

        if (!$.isFunction(options.callback)) {
            throw new Error("prompt requires a callback");
        }

        if (!templates.inputs[options.inputType]) {
            throw new Error("invalid prompt type");
        }

        // create the input based on the supplied type
        input = $(templates.inputs[options.inputType]);

        switch (options.inputType) {
            case "text":
            case "textarea":
            case "email":
            case "date":
            case "time":
            case "number":
            case "password":
                input.val(options.value);
                break;

            case "select":
                var groups = {};
                inputOptions = options.inputOptions || [];

                if (!inputOptions.length) {
                    throw new Error("prompt with select requires options");
                }

                each(inputOptions, function (_, option) {

                    // assume the element to attach to is the input...
                    var elem = input;

                    if (option.value === undefined || option.text === undefined) {
                        throw new Error("given options in wrong format");
                    }


                    // ... but override that element if this option sits in a group

                    if (option.group) {
                        // initialise group if necessary
                        if (!groups[option.group]) {
                            groups[option.group] = $("<optgroup/>").attr("label", option.group);
                        }

                        elem = groups[option.group];
                    }

                    elem.append("<option value='" + option.value + "'>" + option.text + "</option>");
                });

                each(groups, function (_, group) {
                    input.append(group);
                });

                // safe to set a select's value as per a normal input
                input.val(options.value);
                break;

            case "checkbox":
                var values = $.isArray(options.value) ? options.value : [options.value];
                inputOptions = options.inputOptions || [];

                if (!inputOptions.length) {
                    throw new Error("prompt with checkbox requires options");
                }

                if (!inputOptions[0].value || !inputOptions[0].text) {
                    throw new Error("given options in wrong format");
                }

                input = $("<div/>");

                each(inputOptions, function (_, option) {
                    var checkbox = $(templates.inputs[options.inputType]);

                    checkbox.find("input").attr("value", option.value);
                    checkbox.find("label").append(option.text);

                    // we've ensured values is an array so we can always iterate over it
                    each(values, function (_, value) {
                        if (value === option.value) {
                            checkbox.find("input").prop("checked", true);
                        }
                    });

                    input.append(checkbox);
                });
                break;
        }

        if (options.placeholder) {
            input.attr("placeholder", options.placeholder);
        }

        if (options.pattern) {
            input.attr("pattern", options.pattern);
        }

        // now place it in our form
        form.append(input);

        form.on("submit", function (e) {
            e.preventDefault();
            // @TODO can we actually click *the* button object instead?
            // e.g. buttons.confirm.click() or similar
            dialog.find(".btn-primary").click();
        });

        dialog = exports.dialog(options);

        // clear the existing handler focusing the submit button...
        dialog.off("shown.bs.modal");

        // ...and replace it with one focusing our input, if possible
        dialog.on("shown.bs.modal", function () {
            input.focus();
        });

        if (shouldShow === true) {
            dialog.modal("show");
        }

        return dialog;
    };

    exports.dialog = function (options) {
        options = sanitize(options);

        var dialog = $(templates.dialog);
        var body = dialog.find(".modal-body");
        var buttons = options.buttons;
        var buttonStr = "";
        var callbacks = {
            onEscape: options.onEscape
        };
        var modalDialog = dialog.find(".modal-dialog");
        if (options.size) {

            if (options.size == "lg")
                modalDialog.addClass("modal-lg");
            else if (options.size == "sm")
                modalDialog.addClass("modal-sm");
        }
        if (options.zIndex) {
            modalDialog.parent().css("z-index", options.zIndex);
        }

        each(buttons, function (key, button) {
            buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
            callbacks[key] = button.callback;
        });
        if (options.remoteUrl) {
            progressBlock(true, body.find(".bootbox-body"));
            $.ajax({
                url: options.remoteUrl,
                success: function (data) {
                    body.find(".bootbox-body").html(data);
                    sysCore.init.sysCoreRegisterAll(".bootbox-body");
                    if (options.remoteCallback)
                        options.remoteCallback(data);
                },
                error: function (response, textStatus, errorThrown) {
                    body.find(".bootbox-body").html(response.responseText);
                }
            });
        }
        else
            body.find(".bootbox-body").html(options.message);

        if (options.animate === true) {
            dialog.addClass("fade");
        }

        if (options.className) {
            dialog.addClass(options.className);
        }

        if (options.title) {
            body.before(templates.header);
        }

        if (options.closeButton) {
            var closeButton = $(templates.closeButton);

            if (options.title) {
                dialog.find(".modal-header").prepend(closeButton);
            } else {
                closeButton.css("margin-top", "-10px").prependTo(body);
            }
        }

        if (options.title) {
            dialog.find(".modal-title").html(options.title);
        }

        if (buttonStr.length) {
            body.after(templates.footer);
            dialog.find(".modal-footer").html(buttonStr);
        }

        dialog.on("hidden.bs.modal", function (e) {
            if (e.target === this) {
                dialog.remove();
            }
        });

        dialog.on("shown.bs.modal", function () {
            dialog.find(".btn-primary:first").focus();
        });


        dialog.on("escape.close.bb", function (e) {
            if (callbacks.onEscape) {
                processCallback(e, dialog, callbacks.onEscape);
            }
        });


        dialog.on("click", ".modal-footer button", function (e) {
            var callbackKey = $(this).data("bb-handler");

            processCallback(e, dialog, callbacks[callbackKey]);

        });

        dialog.on("click", ".bootbox-close-button", function (e) {
            processCallback(e, dialog, callbacks.onEscape);
        });

        dialog.on("keyup", function (e) {
            if (e.which === 27) {
                dialog.trigger("escape.close.bb");
            }
        });

        $(options.container).append(dialog);

        dialog.modal({
            backdrop: options.backdrop,
            keyboard: true,//2014/05/09:sysCore set false as true
            show: false
        });

        if (options.show) {
            dialog.modal("show");
        }

        return dialog;

    };

    exports.setDefaults = function () {
        var values = {};

        if (arguments.length === 2) {
            // allow passing of single key/value...
            values[arguments[0]] = arguments[1];
        } else {
            // ... and as an object too
            values = arguments[0];
        }

        $.extend(defaults, values);
    };

    exports.hideAll = function () {
        $(".bootbox").modal("hide");
    };


    /**
     * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
     * unlikely to be required. If this gets too large it can be split out into separate JS files.
     */
    var locales = {
        br: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Sim"
        },
        da: {
            OK: "OK",
            CANCEL: "Annuller",
            CONFIRM: "Accepter"
        },
        de: {
            OK: "OK",
            CANCEL: "Abbrechen",
            CONFIRM: "Akzeptieren"
        },
        en: {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        es: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Aceptar"
        },
        fi: {
            OK: "OK",
            CANCEL: "Peruuta",
            CONFIRM: "OK"
        },
        fr: {
            OK: "OK",
            CANCEL: "Annuler",
            CONFIRM: "D'accord"
        },
        he: {
            OK: "אישור",
            CANCEL: "ביטול",
            CONFIRM: "אישור"
        },
        it: {
            OK: "OK",
            CANCEL: "Annulla",
            CONFIRM: "Conferma"
        },
        lt: {
            OK: "Gerai",
            CANCEL: "Atšaukti",
            CONFIRM: "Patvirtinti"
        },
        lv: {
            OK: "Labi",
            CANCEL: "Atcelt",
            CONFIRM: "Apstiprināt"
        },
        nl: {
            OK: "OK",
            CANCEL: "Annuleren",
            CONFIRM: "Accepteren"
        },
        no: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        pl: {
            OK: "OK",
            CANCEL: "Anuluj",
            CONFIRM: "Potwierdź"
        },
        ru: {
            OK: "OK",
            CANCEL: "Отмена",
            CONFIRM: "Применить"
        },
        sv: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        tr: {
            OK: "Tamam",
            CANCEL: "İptal",
            CONFIRM: "Onayla"
        },
        zh_CN: {
            OK: "OK",
            CANCEL: "取消",
            CONFIRM: "确认"
        },
        zh_TW: {
            OK: "OK",
            CANCEL: "取消",
            CONFIRM: "確認"
        }
    };

    exports.init = function (_$) {
        return init(_$ || $);
    };
    //kim
    exports.progress = progress;
    exports.progressWithDelay = progressWithDelay;
    exports.success = success;
    exports.errorAlert = errorAlert;
    exports.progressBlock = progressBlock;
    return exports;
    //======

    //return {
    //    alert: alertMessage,
    //};
}());


sysCore.ajaxHelper = (function () {
    var loadWaiting = false;
    function ajaxSuccess(response, options) {
        if (response.message) {
            if (response.success == true) {
                sysCore.bootstrap.success(response.message);
            }
            else {
                sysCore.bootstrap.alert(response.message);
            }
        }

        if (response.updateHtml && options.updateSelector) {
            $(options.updateSelector).html(response.updateHtml);
            $('[data-toggle="popover"]').popover({ trigger: "click" });//滑鼠移過訊息,Ajax後要重設才不會失效
        }

        if (options.callback) {
            options.callback(response);
        }

        if (response.redirect) {
            location.href = response.redirect;
            return;
        }

    }

    function ajaxFailure(response) {
        if (response.status == 401) {
            window.location.href = "/Account/Login";
            return;
        }

        if (response.status == 405) {
            window.location.href = "/Home/NoPermission";
            return;
        }
        //500的錯誤訊息處理
        if (response.responseJSON && response.responseJSON.message) {
            sysCore.bootstrap.errorAlert(response.responseJSON.message);
            return;
        }
        sysCore.bootstrap.errorAlert(response.responseText);
    }

    function setLoadWaiting(display) {
        loadWaiting = display;
        sysCore.bootstrap.progress(display);
    }

    return {
        postForm: function (options) {
            if (loadWaiting == true) {
                return;
            }

            if (options.formselector && !$(options.formselector).valid())
                return;
            if (!options.postUrl)
                postUrl = $(options.formselector).attr("action");
            else
                postUrl = options.postUrl;
            setLoadWaiting(true);
            $.ajax({
                cache: false,
                url: postUrl,
                data: $(options.formselector).serialize(),
                type: 'post',
                success: function (response) { ajaxSuccess(response, options); },
                complete: function () { setLoadWaiting(false); },
                error: function (response) { ajaxFailure(response); }
            });
        },

        postFormFile: function (options) {
            if (loadWaiting == true) {
                return;
            }

            if (options.formselector && !$(options.formselector).valid())
                return;
            setLoadWaiting(true);
            var formData = new FormData();
            $.each($(options.formselector).find("input[type=file]"), function (i, e) {
                var files = $(e)[0].files;
                $.each(files, function (i, file) {
                    formData.append($(e).attr("name"), file);
                });
            })

            var array = $(options.formselector).serializeArray();
            for (i in array) {
                console.log(array[i].name);
                formData.append(array[i].name, array[i].value);
            }

            $.ajax({
                cache: false,
                url: $(options.formselector).attr("action"),
                data: formData,
                type: 'post',
                processData: false,//配合FormData FileUpload
                contentType: false,//配合FormData FileUpload
                success: function (response) { ajaxSuccess(response, options); },
                complete: function () { setLoadWaiting(false); },
                error: function (response) { ajaxFailure(response); }
            });
        },

        post: function (url, data, callback) {
            if (loadWaiting == true) {
                return;
            }
            setLoadWaiting(true);
            var options = { url: url, data: data, callback: callback };
            $.ajax({
                cache: false,
                url: options.url,
                data: options.data,
                type: 'post',
                success: function (response) { ajaxSuccess(response, options); },
                complete: function () { setLoadWaiting(false); },
                error: function (response) { ajaxFailure(response); }
            });
        },

        get: function (url, data, callback, loadingSelector) {
            if (loadingSelector)
                sysCore.bootstrap.progressBlock(true, $(loadingSelector));
            var options = { url: url, data: data, callback: callback };
            $.ajax({
                url: options.url,
                data: options.data,
                type: 'get',
                success: function (response) { ajaxSuccess(response, options); },
                error: function (response) {
                    ajaxFailure(response);
                    if (loadingSelector)
                        sysCore.bootstrap.progressBlock(false, $(loadingSelector));
                }
            });
        },
        ajaxFailure: ajaxFailure,

    };
})();

//區塊資訊
sysCore.layoutInfo = (function () {
    function addRightTab(key, title) {
        $("#layoutRight").css("width", 0).hide();
        $("#layoutLeft").animate({ width: "75%" }, 400, function () {
            $("#layoutRight").css("width", "25%").show(1);
        });

        $("#ScRightTab").fadeIn(200);
        var menuLink = $("#ScRightMenu-" + key);
        var tab = $("#ScRightPane-" + key);
        if (menuLink.length == 0) {
            var menu = $("<li/>");
            menuLink = $("<a  data-toggle='tab'/>");
            menuLink.attr("id", "ScRightMenu-" + key);
            menuLink.attr("href", "#ScRightPane-" + key);
            menuLink.html(title);
            menu.append(menuLink);
            $("#ScRightTab").append(menu);

            tab = $("<div class='tab-pane' sc-right-pane/>");
            tab.attr("id", "ScRightPane-" + key);
            $("#ScRightContent").append(tab);
        }
        menuLink.tab("show");
        return tab;
    }

    function removeRightTab(key) {
        var menuLink = $("#ScRightMenu-" + key);
        var tab = $("#ScRightPane-" + key);
        if (menuLink.length == 0)
            return;
        var isActivedRemove = $("#ScRightContent .active").attr("id") == tab.attr("id");
        menuLink.parent().remove();
        tab.remove();
        //no tab should be hideing.
        if ($("[sc-right-pane]").length == 0) {
            hideRightTab();
            return;
        }
        //remove tab was current active should be show another one tab
        if (isActivedRemove)
            $('#ScRightTab a:last').tab('show') // Select last tab
    }

    function hideRightTab() {
        $("#layoutLeft").animate({ width: "100%" }, 1);
        $("#layoutRight").animate({ width: "0" }).hide();
    }

    function clearRightTab() {
        $("#ScRightTab").html("");
        $("[sc-right-pane]").remove();
        hideRightTab();
    }

    function footerDescript(descript) {
        if (descript == null || descript.length == 0)
            descript = "...";
        $("#footer-descipt").html(descript);
    }
    return {
        addRight: function (options) {
            options.key = options.key.replace(/[^a-zA-Z0-9.-]/g, "_");
            var hasTab = $("#ScRightMenu-" + options.key).length > 0;
            var tab = addRightTab(options.key, options.title);
            if (hasTab)
                return;
            sysCore.ajaxHelper.get(options.url, options.data, function (response) {
                tab.html(response);
                if (options.callback)
                    options.callback(options, response);
            }, "#" + tab.attr("id"));


        },
        footerDescript: footerDescript,
        hideRight: hideRightTab,
        clearRight: clearRightTab,
        removeRight: removeRightTab,
    };
})();
/*DateRange*/
(function ($) {
    // The validator function
    $.validator.addMethod('rangeDate',
        function (value, element, param) {
            var dateVal = parseDate(value, "G"); // Comes from the KendoDatePicker, use the Global Format
            var minDate;
            var maxDate;

            if (value.length < 1 && param.nullable)
                return true;

            if (param.minDate.length > 0) {
                minDate = parseDate(param.minDate, "G");
            } else {

                var minControl = $('#' + param.minSelector);
                if (minControl.exists()) {
                    minDate = parseDate(minControl.val(), "G");
                } else {
                    return false;
                }
            }

            if (param.maxDate.length > 0) {
                maxDate = parseDate(param.maxDate, "G");
            } else {

                var maxControl = $('#' + param.maxSelector);
                if (maxControl.exists()) {
                    maxDate = parseDate(maxControl.val(), "G");
                } else {
                    return false;
                }
            }

            return minDate <= dateVal && dateVal <= maxDate;
        });
    $.validator.unobtrusive.adapters.add('rangedate', ['minselector', 'maxselector', 'mindate', 'maxdate', 'nullable'],
        function (options) {

            var params = {
                minSelector: options.params.minselector,
                maxSelector: options.params.maxselector,
                minDate: options.params.mindate,
                maxDate: options.params.maxdate,
                nullable: options.params.nullable == "true"
            };
            options.rules['rangeDate'] = params;
            if (options.message) {
                options.messages['rangeDate'] = options.message;
            }
        });
    //modify part http://stackoverflow.com/questions/2587345/javascript-date-parse
    //http://javascript.info/tutorial/datetime-functions
    function parseDate(dateString, format) {
        var newDateString = dateString.replace("T", " ");
        var d = new Date(Date.parse(newDateString));
        return d;
    };

}(jQuery));

/*Table Fixed Header*/
(function ($) {
    return $.fn.fixedHeader = function (options) {
        var config;
        config = {
            topOffset: 40,
            bgColor: "#EEEEEE"
        };
        if (options) {
            $.extend(config, options);
        }
        return this.each(function () {
            var $head, $win, headTop, isFixed, o, processScroll, ww;
            processScroll = function () {
                calculateWidth();
                var headTop, i, isFixed, scrollTop, t;
                if (!o.is(":visible")) {
                    return;
                }
                i = void 0;
                scrollTop = $win.scrollTop();
                t = $head.length && $head.offset().top - config.topOffset;
                if (!isFixed && headTop !== t) {
                    headTop = t;
                }
                if (scrollTop >= headTop && !isFixed) {
                    isFixed = 1;
                } else {
                    if (scrollTop <= headTop && isFixed) {
                        isFixed = 0;
                    }
                }
                //20141106fixedLeft
                $("thead.header-copy").css("left", ($head.offset().left - $win.scrollLeft()) + "px");

                if (isFixed) {
                    return $("thead.header-copy", o).removeClass("hide");
                } else {
                    return $("thead.header-copy", o).addClass("hide");
                }



            };
            o = $(this);
            $win = $(window);
            $head = $("thead", o);
            isFixed = 0;
            headTop = $head.length && $head.offset().top - config.topOffset;
            $win.on("scroll", processScroll);
            //標題點擊捲動，Kim mark 20141022
            //$head.on("click", function () {
            //    if (!isFixed) {
            //        return setTimeout((function () {
            //            return $win.scrollTop($win.scrollTop() - 47);
            //        }), 10);
            //    }
            //});
            if (o.has(".header-copy").length == 0) {
                $head.clone(true, true).addClass("header-copy header-fixed").appendTo(o);
            }
            //20150424Kim:捲動也要重算寬度
            calculateWidth = function () {
                ww = [];
                o.find("thead > tr:first > th").each(function (i, h) {
                    //20150424:Kim若已有設定width則取原本的
                    var width = $(h).attr("width") ? $(h).attr("width") : $(h).outerWidth();
                    return ww.push(width);
                });
                $.each(ww, function (i, w) {
                    return o.find("thead > tr > th:eq(" + i + "), thead.header-copy > tr > th:eq(" + i + ")").css({
                        width: w
                    });
                });
                o.find("thead.header-copy").css({
                    margin: "0 auto",
                    width: o.width(),
                    "background-color": config.bgColor
                });
            }


            //calculateWidth();
            return processScroll();
        });
    };
})(jQuery);


sysCore.init = (function () {
    function setScrollTop() {
        var scrolltop = $('#scrolltop');
        if (scrolltop.length == 0)
            return;
        var viewPortHeight = parseInt(document.documentElement.clientHeight);
        var scrollHeight = parseInt(document.body.getBoundingClientRect().top);
        if ($(document).scrollTop() > scrollHeight + 250) {
            scrolltop.show(200);
        } else {
            scrolltop.hide();
        }
    }

    function sysCoreRegisterFormEvent(targetSelector) {
        //form post submiting 目前get會用在檔案下載，而無法自動關閉進度畫面，所以get不使用
        var $form = null;
        if (targetSelector)
            $form = $(targetSelector + " form[method=post]");
        else
            $form = $("form[method=post]");
        $form.on("submit", function (e) {
            if ($(this).attr("sc-form-event") == "N")
                return;
            if ($(this).valid() && sysCore.init.formSubmiting == false) {
                sysCore.bootstrap.progressBlock(true, $(this));
                sysCore.init.formSubmiting = true;
                return;
            }
            console.log(sysCore.init.formSubmiting);
            e.preventDefault();
        })
    }

    function sysCoreRegisterDefaultValidation(targetSelector) {
        jQuery.validator.unobtrusive.parse(targetSelector);//重新Trigger Validation
    }

    //在其他ajax或angular的開窗或載入html需重新註冊相關事件
    function sysCoreRegisterAll(targetSelector) {
        sysCoreRegisterFormEvent(targetSelector);
        sysCoreRegisterDefaultValidation(targetSelector);
    }

    function fixedTableHeader(targetSelector) {
        var $grid = null;
        if (targetSelector)
            $grid = $(targetSelector).fixedHeader();
        else
            $grid = $("[data-fixed-header=True]").fixedHeader();
    }
    //init
    sysCoreRegisterFormEvent();//for normal form submit use no include ajax ,so if occur error that need to be add conditoin to avoid that
    setScrollTop();

    //ScrollTop
    $(window).scroll(setScrollTop);
    $("#scrolltop button").on("click", function () {
        $('html,body').animate({ scrollTop: 0 }, 500);
    })

    //e2etest
    if (window.sessionStorage["e2e-test"]) {
        $(".main-footer").remove();
    }

    //favroite
    $("[sc-fav]").on("click", function () {
        sysCore.ajaxHelper.get($(this).attr("sc-fav"), ""
       , function (response) {
           $("#leftMenu").html(response.data.html);
           $("[sc-fav]").attr("sc-fav", response.data.scFav);
           if (response.data.IsAdded) {
               $("[sc-fav] i").removeClass("fa-star-o");
               $("[sc-fav] i").addClass("fa-star");
           }
           else {
               $("[sc-fav] i").removeClass("fa-star");
               $("[sc-fav] i").addClass("fa-star-o");
           }
           //left menu
           $.AdminLTE.layout.activate();
           //Enable sidebar tree view controls
           $.AdminLTE.tree('.sidebar');


       })

    })

    //left-menu-dir-begin
    var rootMenuKey = $("[sc-root-menu-key]").attr("sc-root-menu-key");
    var dirKey = "sc-left-dir-" + rootMenuKey;
    var prgKey = "sc-left-prg-" + rootMenuKey;
    $("[sc-left-prg]").on("click", function () {
        var dirNo = $(this).attr("sc-left-dir");
        var prgNo = $(this).attr("sc-left-prg");
        var homeRootMenuKey = $(this).attr("sc-root-menu-key");
        if (homeRootMenuKey) {
            dirKey = "sc-left-dir-" + homeRootMenuKey;
            prgKey = "sc-left-prg-" + homeRootMenuKey;
        }
        localStorage.setItem(dirKey, dirNo);
        sessionStorage.setItem(prgKey, prgNo);
    })

    if (localStorage.getItem(dirKey)) {

        var dirNo = localStorage.getItem(dirKey).replace("sc-left-dir-", "");
        $("li[sc-left-dir='" + dirNo + "']").addClass("active");
    }
    if (sessionStorage.getItem(prgKey)) {
        var prgNo = sessionStorage.getItem(prgKey).replace("sc-left-prg-", "");
        $("li a[sc-left-prg='" + prgNo + "']").parent().addClass("active");
        sessionStorage.removeItem(prgKey);//Program need once used to be removed.
    }
    //lef-menu-dir-end
    return {
        sysCoreRegisterFormEvent: sysCoreRegisterFormEvent
        , formSubmiting: false//for normal form submit use
        , sysCoreRegisterAll: sysCoreRegisterAll
        , fixedTableHeader: fixedTableHeader
    };
})();

sysCore.common = (function () {
    //取消按了Enter送出
    function cancelPressEnter(e) {
        var code = e.keyCode || e.which;
        if (code == 13) { //Enter keycode
            e.preventDefault();
            return true;
        }
        return false;
    }

    function setFocus($element) {
        setTimeout(function () { $element.focus(); }, 100);
    }
    return {
        cancelPressEnter: cancelPressEnter
        , setFocus: setFocus
    };
})();