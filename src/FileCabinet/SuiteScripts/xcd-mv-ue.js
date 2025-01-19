/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

var record, redirect;
var modules = ["N/record", "N/redirect"];

define(modules, main);

function main(recordModule, redirectModule) {
    record = recordModule;
    redirect = redirectModule;
    return { afterSubmit: afterSubmit };
}

function afterSubmit(context) {
    try {
        const CurrentRecord = record.load({
            type: 'customrecord_xcd_tournament',
            id: 1
        });

        var selectedPlayers = CurrentRecord.getText({ fieldId: 'custrecord_xcd_selected_players' });

        if (Array.isArray(selectedPlayers)) {
            selectedPlayers = selectedPlayers.join(',');
        }

        log.debug('Selected Players', selectedPlayers);

        redirect.toSuitelet({
            scriptId: 'customscript_xcd_mv_sl',
            deploymentId: 'customdeploy_xcd_mv_sl',
            parameters: {
                selectedPlayers: selectedPlayers
            }
        });

        log.debug('Redirect', 'Redirecting to Suitelet');
    } catch (error) {
        log.error('Record Load Error', error.message);
    }
}