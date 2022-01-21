###### _When using a config file from this site the UI for shuffles in the game client becomes useless as it wasn't made to work with configs like these_

# Quickstart

1. Drag & Drop your items where you want them
2. Download your config
3. Replace `<YOUR_STEAM_INSTALLATION_PATH>/userdata/<YOUR_STEAM_3ID>/730/remote/cfg/csgo_saved_item_shuffles.txt` with your new config file **while your game isn't running**
4. Start the game and enjoy!

To revert the applied config you have to disable shuffle for the slots manually or reset all at once by using this [config file](https://csgoinvshuffle.kreyoo.dev/csgo_saved_item_shuffles.txt).

# Functionality in Detail

You can imagine the table as a queue. Every queue slot is labeled with a number. After applying the config the game will determine the next item based on the queue.
Loading into a map means one step forward in the queue. When no item is left in the queue for a loadout slot, the queue will start over for that slot.

## Shuffle Button

When using the `Shuffle` functionality, all your items in the table will be taken and stacked up to `100` queue slots in random order.
Don't worry! You can always revert the change using the `Back` and `Forth` buttons symbolized with arrows.

## Import and Export Button

You can export your table into a JSON file any time. By that you save your progress from being deleted after you got logged out automatically after 3 days.

## Delete Button

Deletes the whole table with all its checkpoints.
Handle with care all unexported progress will be lost!

# Any Issues?

Create an Issue or contribute on [GitHub](https://github.com/kreyoo/csgo-inv-shuffle-web).

Have some very special needs?
You can use the [python package](https://github.com/kreyoo/csgo-inv-shuffle).
