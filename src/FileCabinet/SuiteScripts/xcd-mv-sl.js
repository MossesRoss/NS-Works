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

var serverWidget, record, file;

var modules = ["N/ui/serverWidget", "N/record", "N/file"];

define(modules, main);

function main(serverWidgetModule, recordModule, fileModule) {
    serverWidget = serverWidgetModule;
    record = recordModule;
    file = fileModule;
    return { onRequest: onRequest };
}

function onRequest(context) {
    if (context.request.method === 'GET') {
        var form = serverWidget.createForm({
            title: 'CD Mark X',
            hideNavigationBar: true
        });

        // B A C K E N D
        // Records Manipulation
        try {
            var playersNameRecord = record.load({
                type: 'customrecord_xcd_player',
                id: 1
            });
        } catch (error) {
            log.error('Record Load Error', error.message);
            return;
        }
        var playerName = playersNameRecord.getValue('name');
        var playerCC = playersNameRecord.getValue('custrecord_xcd_crash_cash');
        var playersCars = playersNameRecord.getValue('custrecord_xcd_cars_owned');
        var tornamentsPlayed = playersNameRecord.getValue('custrecord_xcd_tours_played');
        var tornamentsWon = playersNameRecord.getValue('custrecord_xcd_tours_won');
        var noOfTournamentsPlayed = playersNameRecord.getValue('custrecord_xcd_number_of_tp');
        var noOfTournamentsWon = playersNameRecord.getValue('custrecord_xcd_number_of_tw');
        var gamesPlayed = playersNameRecord.getValue('custrecord_xcd_games_played');

        //  U I   E L E M E N T S
        // BUTTONS

        form.addButton({ id: 'custpage_btn_crash', label: 'Crash', functionName: 'crashingCar()' });
        form.addButton({ id: 'custpage_btn_plate', label: 'Plate' });
        form.addButton({ id: 'custpage_btn_drift', label: 'Drift' });

        // FIELD GROUPS
        form.addFieldGroup({ id: 'custpage_grp_current_game', label: "Current Game" });
        form.addFieldGroup({ id: 'custpage_grp_remainings', label: "Remainings" });
        form.addFieldGroup({ id: 'custpage_grp_current_player_info', label: "Player Info" });

        // FIELDS
        // Current Game
        var gameCountFld = form.addField({
            id: 'custpage_fld_game_count',
            label: 'Game Count',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_game'
        });
        var playerNameFld = form.addField({
            id: 'custpage_fld_player_name',
            label: 'Player Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_current_game'
        });
        var crashCashFld = form.addField({
            id: 'custpage_fld_crash_cash',
            label: 'Crash Cash',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_game'
        });
        var remainingCarsFld = form.addField({
            id: 'custpage_fld_remaining_cars_name',
            label: 'Remaining Cars',
            type: serverWidget.FieldType.TEXTAREA,
            container: 'custpage_grp_current_game'
        });
        // Player Info
        var totalGamesPlayedFld = form.addField({
            id: 'custpage_fld_total_games_played',
            label: 'Games Played',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_player_info'
        });
        var tornamentsPlayedFld = form.addField({
            id: 'custpage_fld_total_tors_played',
            label: 'Tornaments Played',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_current_player_info'
        });
        // Remainings
        var remainingPlayersCountFld = form.addField({
            id: 'custpage_fld_nof_remaining_players',
            label: 'Remaining Players Count',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_remainings'
        });
        var remainingPlayersFld = form.addField({
            id: 'custpage_fld_remaining_players_name',
            label: 'Remaining Players Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_remainings'
        });
        var totalRemainingCarsFld = form.addField({
            id: 'custpage_fld_total_remaining_cars_name',
            label: 'Remaining Cars Name',
            type: serverWidget.FieldType.TEXTAREA,
            container: 'custpage_grp_remainings'
        });
        var importentNoteFld = form.addField({
            id: 'custpage_fld_importent_note',
            label: 'Note: This is still under development so, use carfully and report bugs to Mosses if you find any (mosasross@gmail.com).',
            type: serverWidget.FieldType.HELP
        });
        var inlineHtml = form.addField({
            id: 'custpage_chart',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'Car Stunt Chart'
        });
        // HTML
        // var chartJsFile = file.load({
        //     id: '26762' 
        // });
        // var chartJsContent = chartJsFile.text;
        inlineHtml.defaultValue = '<html>' +
        '<head>' +
        '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>' + 
        '</head>' +
        '<body>' +
        '<h1>Crash Cash Leaderboard</h1>' +
        '<canvas id="crashCashChart" width="400" height="400"></canvas>' +
        '<script>' +
        'document.addEventListener("DOMContentLoaded", function() {' +
        'var ctx = document.getElementById("crashCashChart").getContext("2d");' +
        'new Chart(ctx, {' +
        'type: "bar",' +
        'data: {' +
        'labels: ["Player 1", "Player 2", "Player 3"],' +
        'datasets: [{' +
        'label: "Crash Cash",' +
        'data: [5000, 3000, 7000],' +
        'backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]' +
        '}]' +
        '},' +
        'options: {' +
        'scales: {' +
        'y: { beginAtZero: true }' +
        '}' +
        '}' +
        '});' +
        '});' +
        '</script>' +
        '</body>' +
        '</html>';

        log.debug('inline HTML', inlineHtml.defaultValue);

        // DISPLAY TYPES
        function setFieldsDisplayType(fields, displayType) {
            fields.forEach(function (field) {
                field.updateDisplayType({ displayType: displayType });
            });
        }
        var disablableFields = [gameCountFld, playerNameFld, /*crashCashFld*/ remainingCarsFld,
            totalGamesPlayedFld, tornamentsPlayedFld, remainingPlayersCountFld,
            remainingPlayersFld, totalRemainingCarsFld];

        setFieldsDisplayType(disablableFields, serverWidget.FieldDisplayType.INLINE);

        importentNoteFld.updateLayoutType({
            layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE

        })
        // B A C K E N D

        // Getting data from the Record
        totalRemainingCarsFld.defaultValue = playersCars;
        remainingPlayersFld.defaultValue = playerName;
        playerNameFld.defaultValue = playerName;
        crashCashFld.defaultValue = playerCC;
        // remainingPlayersCountFld.defaultValue = remainingPlayersFld.length();
        totalGamesPlayedFld.defaultValue = gamesPlayed;
        tornamentsPlayedFld.defaultValue = noOfTournamentsPlayed;

        remainingPlayersFld.defaultValue = context.request.parameters.selectedPlayers;


        form.clientScriptModulePath = './xcd-mv-cs.js';
        form.addSubmitButton();
        context.response.writePage(form);
    }
    else if (context.request.method === 'POST') {
        var form = serverWidget.createForm({
            title: 'Game Saved Successfully'
        });
        //  B A C K E N D
        // Loading Record
        var playersNameRecord = record.load({
            type: 'customrecord_xcd_player',
            id: 1
        });
        // Updating Record (From Field Values to record)
        playersNameRecord.setValue({
            fieldId: 'custrecord_xcd_crash_cash',
            value: context.request.parameters.custpage_fld_crash_cash
        });

        playersNameRecord.save();

        form.addField({
            id: 'custpage_success_message',
            type: serverWidget.FieldType.INLINEHTML,
            label: ' '
        }).defaultValue = '<br><a href="/app/center/card.nl?sc=-29&whence=" style = "text-decoration: none;">Go Home</a>';
    
        context.response.writePage(form);
    }
}