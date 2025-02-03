/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/record"], function (serverWidget, record) {
    function onRequest(context) {
        if (context.request.method === "GET") {
            var form = serverWidget.createForm({
                title: "Car Stunt Suitelet"
            });

            var field = form.addField({
                id: "custpage_simple_field",
                type: serverWidget.FieldType.TEXT,
                label: "Enter Something"
            });

            form.clientScriptModulePath = "./pg-cs.js";
            context.response.writePage(form);
        } else if (context.request.method === "POST") {
            var request = context.request;
            var response = context.response;
            var params = request.parameters;
            var simpleField = params.custpage_simple_field;
            log.debug("Simple Field", simpleField);
        }
    }
    return {
        onRequest: onRequest
    };
});