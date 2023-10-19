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

    if (windowsOnWorkspace.length === 1 && !windowsOnWorkspace[0].meta_window.maximized_horizontally && !windowsOnWorkspace[0].meta_window.maximized_vertically) {
        windowsOnWorkspace[0].meta_window.maximize(Meta.MaximizeFlags.BOTH);
    }
}
