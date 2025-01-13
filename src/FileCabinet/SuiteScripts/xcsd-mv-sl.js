/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

/*
Name          : Simple Suitelet with Button
Author        : Mosses
Description   : Creates a simple button on the screen.
Dependencies  : None
Release Date  : 2025-01-09
Version       : 1.0.0
Changing      : 1.0.0 - Initial release
Website       : www.cloudio.com
*/

var serverWidget, record;

var modules = ["N/ui/serverWidget", "N/record"];

define(modules, main);

function main(serverWidgetModule, recordModule) {
    serverWidget = serverWidgetModule;
    record = recordModule;
    return { onRequest: onRequest };
}

function onRequest(context) {
    if (context.request.method === 'GET') {
        var form = serverWidget.createForm({
            title: 'CSDT Mark X',
            hideNavigationBar: true
        });

        // Buttons
        form.addButton({
            id: 'custpage_crash_button',
            label: 'Crash',
            functionName: 'crashingCar()'
        });
        form.addButton({
            id: 'custpage_plate',
            label: 'Plate'
        });

        // Field Groups
        form.addFieldGroup({
            id: 'custpage_grp_current_game',
            label: "Current Game"
        });
        form.addFieldGroup({
            id: 'custpage_grp_remainings',
            label: "Remainings"
        });
        form.addFieldGroup({
            id: 'custpage_grp_current_player_info',
            label: "Player Info"
        });

        // Fields
        // Current Game
        form.addField({
            id: 'custpage_fld_game_no',
            label: 'Game Number',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_game'
        });
        form.addField({
            id: 'custpage_fld_player_name',
            label: 'Player Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_current_game'
        });
        form.addField({
            id: 'custpage_fld_crash_cash',
            label: 'Crash Cash',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_game'
        });
        form.addField({
            id: 'custpage_fld_remaining_cars_name',
            label: 'Player Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_current_game'
        });
        // Player Info
        form.addField({
            id: 'custpage_fld_total_games_played',
            label: 'Games Played',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_player_info'
        });
        form.addField({
            id: 'custpage_fld_total_tors_played',
            label: 'Tornaments Played',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_player_info'
        });
        // Remainings
        form.addField({
            id: 'custpage_fld_nof_remaining_players',
            label: 'Remaining Players Count',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_remainings'
        });
        form.addField({
            id: 'custpage_fld_remaining_players_name',
            label: 'Remaining Players Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_remainings'
        });
        form.addField({
            id: 'custpage_fld_t_remaining_cars_name',
            label: 'Remaining Players Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_remainings'
        });


        form.clientScriptModulePath = './csd-cs-v2.js';
        form.addSubmitButton();
        context.response.writePage(form);
    }
    else if (context.request.method === 'POST') {

    }
}