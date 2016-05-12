// ==UserScript==
// @name         Fuck this queue.. Bot.
// @version      0.1
// @description  Click 'Not Interested' automatically for all games and starts new queue until broken.
// @author       tech_engineer / maestro_it / Kingsland
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/explore/
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
/* jshint -W097 */

(function(){
    "use strict";
    
    // This list no longer matters, it clicks Not Interested on every single game.  We're smart people, we get into games through personal recommendations and main-stream advertising.
    var unwantedGames = ['Indie', 'JRPG', 'Casual', 'Early Access'];
    
    var autoSubmit = true; // automatically submit the form after the timeout (next var)
    var timeoutToSubmit = 5; // if autosubmit is enabled wait this amount in seconds before clicking next
    var showReasons = false; // show the tags next to the not interested button
    var showDonate = true; // show donation button on the Explore page
    var keepGoing = true; //Keep starting new discovery queues
    
    /*
    // this is coming soon
    try {
        GM_setValue('GM_UnwantedList', unwantedGames);
    
        var retVar = GM_getValue('GM_UnwantedList');
        console.log('Returned list size is: ' + retVar.length);
    } catch (e) {
        console.log('ERROR in GM functions: ' + e);
    }
    */
    
    try {
        if ($J("#next_in_queue_form") !== null) {

            var needToClick = false;
            var clickReasons = [];
			
            if ($J("div#add_to_wishlist_area_success").is(":hidden")) { // fix the blacklisting of games on wishlist
                $J("a.app_tag").each(function () {
                    var appTag = $J(this).text().trim();
                    if ($J.inArray(appTag, unwantedGames) >= -1) {
                        //console.log("Game will be marked because of: " + appTag);
                        clickReasons.push(appTag);
                        needToClick = true;
                    }
                });

                if (needToClick) {
                    console.log("> Clicks the 'Not Interested' Button.");
                    $J('.queue_control_button.queue_btn_ignore .queue_btn_inactive').click();
                    if (showReasons) {
                        $J('.queue_control_button.queue_btn_ignore .queue_btn_inactive').parent().append('<span> ' + clickReasons.join(", ") + "</span>");
                    }
                }
            }
            
            if (autoSubmit && ($J("div.btn_next_in_queue").length)){
                console.log('Adding a timer and setting the interval');
                $J('<div id="GM_cancelInterval" class="btn_next_in_queue  right" style="width: 25px;margin-right: 0px;background-size: 200% 200%;" title="Click to stop the timer"><div class="next_in_queue_content"><span id="GM_timeoutSubmit" style="position: relative;top: 8px;left: 6px; cursor: hand;" onclick="clearInterval(GM_interval);">' + timeoutToSubmit + '</span></div></div>').insertAfter($J("div.btn_next_in_queue"));
                var GM_interval = setInterval(function(){
                    timeoutToSubmit--;
                    $J("span#GM_timeoutSubmit").text(timeoutToSubmit);

                    if (timeoutToSubmit == 0) {
                        clearInterval(GM_interval);
                        $J('#next_in_queue_form').submit();
                    }
                }, 1000);
                $J('div#GM_cancelInterval').on('click', function() {
                    console.log('Cancelling timer.');
                    clearInterval(GM_interval);
                });
            }
            
            var allTags = [];
            $J("a.app_tag").each(function () {
                allTags.push($J(this).text().trim());
            });
            console.log("List of all tags: " + allTags.join(", "));
        };
        
        // this part is from https://github.com/mig4ng/SteamQueueBotChristmas2015
        if ($J('div.discover_queue_empty_refresh_btn').length) {
            if(showDonate){
                 $J( "<br><div style='border: 2px solid #315A73; padding: 10px; background: #79A9C6; color: #315A73; font-family: arial;'><font style='font-size: 30px;'>Fuck This Queue..  Bot.</font></br>Click 'Not Interested' on <i>everything</i><br /><br /><font style='font-size: 10px;'>Made by <b>tech_engineer / maestro_it</b> | Edited by <b>Kingsland</b></font></div>" ).insertAfter( ".discover_queue_empty_refresh_btn" );
                keepGoing = true;
            }
            if(keepGoing) {
                timeoutToSubmit--;
                console.log("Starting new queue...");
                $J('#refresh_queue_btn').click();

            } 
        }
        
    } catch(e) {
        console.log("Error: " + e);
    }
})();