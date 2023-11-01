import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

let windowTracker, activeWindowChangedId, activeWorkspaceChangedId;

function init() {}

export default class thisExtension {
    enable() {
        windowTracker = Shell.WindowTracker.get_default();
        activeWindowChangedId = windowTracker.connect('notify::focus-app', checkAndFullScreenWindow);
        activeWorkspaceChangedId = global.window_manager.connect('switch-workspace', checkAndFullScreenWindow);
    }

    disable() {
        windowTracker.disconnect(activeWindowChangedId);
        global.window_manager.disconnect(activeWorkspaceChangedId);
        windowTracker = null;
    }
}

function checkAndFullScreenWindow() {
    let activeWorkspace = global.workspace_manager.get_active_workspace_index();
    
    let windowsOnWorkspace = global.get_window_actors().filter(w => w.meta_window.get_workspace().index() === activeWorkspace && w.meta_window.get_window_type() !== Meta.WindowType.DESKTOP);

    // Group windows by their monitor
    let monitorsWindows = {};
    windowsOnWorkspace.forEach(w => {
        let monitorIndex = w.meta_window.get_monitor();
        if (!monitorsWindows[monitorIndex]) {
            monitorsWindows[monitorIndex] = [];
        }
        monitorsWindows[monitorIndex].push(w);
    });

    // Iterate through each monitor's windows
    for (let monitorIndex in monitorsWindows) {
        if (monitorsWindows[monitorIndex].length === 1) {
            let window = monitorsWindows[monitorIndex][0];
            if (!window.meta_window.maximized_horizontally && !window.meta_window.maximized_vertically) {
                window.meta_window.maximize(Meta.MaximizeFlags.BOTH);
            }
        }
    }
}
