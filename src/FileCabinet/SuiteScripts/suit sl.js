/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/*
Name          : Car Stunt Data Tracker Mark X (Final MVP)
Author        : Mosses
Description   : Creates a simple Suitelet form with buttons, and logic
                        to track and update cars, and overall players data.
Dependencies  : None
Release Date  : 2025-01-09
Version       : 1.1.x
Changing      : 1.0.0 - Initial release (basic button display)
                   1.1.x - Implement server-side, and client-side logic.
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
            title: 'Car Stunt Data Tracker X',
            hideNavigationBar: true
        });

        var YohanRec = record.load({
            type: 'customrecord_xcd_player',
            id: 2
        });

        var playersDataJSONString = context.request.parameters.playersDataJSONString;
        var playersNameArrayString = context.request.parameters.playersNameArrayString;
        //  U I   E L E M E N T S
        // BUTTONS
        form.addButton({ id: 'custpage_btn_crash', label: 'Crash', functionName: 'crashingCar()' });
        form.addButton({ id: 'custpage_btn_plate', label: 'Plate', functionName: 'platingCar()' });
        form.addButton({ id: 'custpage_btn_drift', label: 'Drift', functionName: 'driftingCar()' });
        form.addButton({ id: 'custpage_btn_just_riding', label: 'Just Riding', functionName: 'justRiding()' });
        form.addButton({ id: 'custpage_btn_plate_rounding', label: 'Plate Round', functionName: 'plateRounding()' });
        form.addButton({ id: 'custpage_btn_load_next_player', label: 'Load Next Player', functionName: 'loadNextPlayer()' });
        form.addButton({ id: 'custpage_btn_add_custom_cc', label: '+', functionName: 'addCustomCC()' });
        form.addButton({ id: 'custpage_btn_remove_custom_cc', label: '-', functionName: 'removeCustomCC()' });
        // FIELD GROUPS
        form.addFieldGroup({ id: 'custpage_grp_current_game', label: "Current Game" });
        form.addFieldGroup({ id: 'custpage_grp_current_player_info', label: "Player Info" });
        form.addFieldGroup({ id: 'custpage_grp_remainings', label: "Remainings" });
        form.addFieldGroup({ id: 'custpage_grp_others', label: "Others" });
        // FIELDS
        // Current Game
        var playerNameFld = form.addField({
            id: 'custpage_fld_player_name',
            label: 'Player Name',
            type: serverWidget.FieldType.TEXT,
            container: 'custpage_grp_current_game'
        });
        var profilePictureFld = form.addField({
            id: 'custpage_fld_profile_picture',
            label: 'Player Profile',
            type: serverWidget.FieldType.INLINEHTML,
            container: 'custpage_grp_current_game'
        })

        var currentPlayingCarFld = form.addField({
            id: 'custpage_fld_current_playing_car',
            label: 'Current Playing Car',
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

        remainingCarsFld.updateBreakType({
            breakType: serverWidget.FieldBreakType.STARTCOL,

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
        var carsOwnedFld = form.addField({
            id: 'custpage_fld_cars_owned',
            label: 'Cars Owned',
            type: serverWidget.FieldType.TEXTAREA,
            container: 'custpage_grp_current_player_info'
        });
        // Remainings
        var totalRemainingCarsFld = form.addField({
            id: 'custpage_fld_total_remaining_cars_name',
            label: 'Remaining Cars Name',
            type: serverWidget.FieldType.TEXTAREA,
            container: 'custpage_grp_remainings'
        })
        var remainingPlayersCountFld = form.addField({
            id: 'custpage_fld_nof_remaining_players',
            label: 'Remaining Players Count',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_remainings'
        })
        var remainingPlayersFld = form.addField({
            id: 'custpage_fld_remaining_players_name',
            label: 'Remaining Players Name',
            type: serverWidget.FieldType.TEXTAREA,
            container: 'custpage_grp_remainings'
        }).updateDisplaySize({
            height: 8.5,
            width: 55
        });
        remainingPlayersFld.updateBreakType({
            breakType: serverWidget.FieldBreakType.STARTCOL,

        });
        var importentNoteFld = form.addField({
            id: 'custpage_fld_importent_note',
            label: 'Note: This is still under development so, use carefully and report bugs to Mosses if you find any (mosasross@gmail.com).',
            type: serverWidget.FieldType.HELP
        });
        // Others
        var gameCountFld = form.addField({
            id: 'custpage_fld_game_count',
            label: 'Game Count',
            type: serverWidget.FieldType.INTEGER,
            container: 'custpage_grp_others'
        });
        var playersNameArrayStringFld = form.addField({
            id: 'custpage_fld_players_array',
            label: 'Players Array',
            type: serverWidget.FieldType.TEXTAREA
        }).updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        var playersDataJSONStringFld = form.addField({
            id: 'custpage_fld_player_data_json',
            label: 'Player Data JSON String',
            type: serverWidget.FieldType.TEXTAREA
        }).updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        // DISPLAY TYPES
        function setFieldsDisplayType(fields, displayType) {
            fields.forEach(function (field) {
                field.updateDisplayType({ displayType: displayType });
            });
        }
        var disablableFields = [playerNameFld, crashCashFld, remainingCarsFld, currentPlayingCarFld];
        var hideableFields = [gameCountFld, remainingPlayersFld, totalRemainingCarsFld,
            totalGamesPlayedFld, carsOwnedFld, tornamentsPlayedFld, remainingPlayersCountFld]

        setFieldsDisplayType(disablableFields, serverWidget.FieldDisplayType.INLINE);
        setFieldsDisplayType(hideableFields, serverWidget.FieldDisplayType.HIDDEN)
        importentNoteFld.updateLayoutType({
            layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
        });
        playersDataJSONStringFld.defaultValue = playersDataJSONString;
        playersNameArrayStringFld.defaultValue = playersNameArrayString;
        form.clientScriptModulePath = './xcd-mv-cs.js';
        form.addSubmitButton();
        context.response.writePage(form);
    }
    //  P O S T
    else if (context.request.method === 'POST') {
        var form = serverWidget.createForm({
            title: 'Game Saved Successfully'
        });

        var playerId = context.request.parameters.playerId;
        var crashCash = context.request.parameters.crashCash;

        if (playerId) {
            var playersNameRecord = record.load({
                type: 'customrecord_xcd_player',
                id: playerId
            });
            playersNameRecord.setValue({
                fieldId: 'custrecord_xcd_crash_cash',
                value: crashCash
            });
            playersNameRecord.save();
        }
        form.addField({
            id: 'custpage_success_message',
            type: serverWidget.FieldType.INLINEHTML,
            label: ' '
        }).defaultValue = '<br><a href="/app/center/card.nl?sc=-29&whence=" style="text-decoration: none;">Go Home</a>';
        context.response.writePage(form);
    }
}
