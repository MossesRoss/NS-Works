/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

var serverWidget, file, _;
modules = ['N/ui/serverWidget', 'N/file', '/SuiteScripts/lodash.js'];
define(modules, main);

function main(serverWidgetMod, fileMod, lodashMod) {
    serverWidget = serverWidgetMod;
    file = fileMod;
    _ = lodashMod;
    return {
    onRequest: onRequest
    };
}

function onRequest(context) {
    var form = serverWidget.createForm({
        title: 'Load Lodash',
    });
    var testArry = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var testArrySum = _.sum (testArry, 2);
    form.addField({
        id: 'custpage_message',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Message',
    }).defaultValue = 'Sum of ' + testArry + ' is ' + testArrySum;
    context.response.writePage(form);
}
