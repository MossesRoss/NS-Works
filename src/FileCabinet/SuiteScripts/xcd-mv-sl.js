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
            title: 'Car Stunt Data Tracker X',
            hideNavigationBar: true
        });

        // B A C K E N D
        // Records Manipulation
        var playersDataJSONString = context.request.parameters.playersDataJSONString;
        var playersNameArrayString = context.request.parameters.playersNameArrayString;

        // try {
        //     var playersNameRecord = record.load({
        //         type: 'customrecord_xcd_player',
        //         id: 1
        //     });
        // } catch (error) {
        //     log.error('Record Load Error', error.message);
        //     return;
        // }

        // var playerName = playersNameRecord.getValue('name');
        // var playerCC = playersNameRecord.getValue('custrecord_xcd_crash_cash');
        // var playersCars = playersNameRecord.getValue('custrecord_xcd_cars_owned');
        // var tornamentsPlayed = playersNameRecord.getValue('custrecord_xcd_tours_played');
        // var tornamentsWon = playersNameRecord.getValue('custrecord_xcd_tours_won');
        // var noOfTournamentsPlayed = playersNameRecord.getValue('custrecord_xcd_number_of_tp');
        // var noOfTournamentsWon = playersNameRecord.getValue('custrecord_xcd_number_of_tw');
        // var gamesPlayed = playersNameRecord.getValue('custrecord_xcd_games_played');

        //  U I   E L E M E N T S
        // BUTTONS
        form.addButton({ id: 'custpage_btn_crash', label: 'Crash', functionName: 'crashingCar()' });
        form.addButton({ id: 'custpage_btn_plate', label: 'Plate', functionName: 'platingCar()' });
        form.addButton({ id: 'custpage_btn_drift', label: 'Drift', functionName: 'driftingCar()' });
        form.addButton({ id: 'custpage_btn_just_riding', label: 'Just Riding', functionName: 'justRiding()' });
        form.addButton({ id: 'custpage_btn_plate_rounding', label: 'Plate Round', functionName: 'plateRounding()' });
        form.addButton({ id: 'custpage_btn_load_next_player', label: 'Load Next Player', functionName: 'loadNextPlayer()' });

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



        // remainingCarsFld.updateLayoutType({
        //     layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW});
        // remainingCarsFld.updateDisplaySize({
        //     height:2,
        //     width:92
        // })
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

        var inlineHtml = form.addField({
            id: 'custpage_chart',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'Car Stunt Chart'
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

        // B A C K E N D
        // Setting The default Values

        // totalRemainingCarsFld.defaultValue = playersCars;
        // remainingPlayersFld.defaultValue = playerName;
        // playerNameFld.defaultValue = playerName;
        // crashCashFld.defaultValue = playerCC;
        // totalGamesPlayedFld.defaultValue = gamesPlayed;

        playersDataJSONStringFld.defaultValue = playersDataJSONString;
        playersNameArrayStringFld.defaultValue = playersNameArrayString;

        remainingPlayersFld.defaultValue = context.request.parameters.selectedPlayers;

        form.clientScriptModulePath = './xcd-mv-cs.js';
        form.addSubmitButton();
        context.response.writePage(form);

    }

    //  P O S T   (Post)

    else if (context.request.method === 'POST') {
        var form = serverWidget.createForm({
            title: 'Game Saved Successfully'
        });

        var playerId = context.request.parameters.playerId;
        var crashCash = context.request.parameters.crashCash;

        if (playerId) {
            log.debug('playerId', playerId);
            log.debug('crashCash', crashCash);

            //  B A C K E N D
            // Loading Record
            var playersNameRecord = record.load({
                type: 'customrecord_xcd_player',
                id: playerId
            });

            // Updating Record (From Field Values to record)
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