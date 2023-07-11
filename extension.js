const { Meta, Shell } = imports.gi;
const Main = imports.ui.main;

let windowTracker, activeWindowChangedId, activeWorkspaceChangedId;

function init() {}

function enable() {
    windowTracker = Shell.WindowTracker.get_default();
    activeWindowChangedId = windowTracker.connect('notify::focus-app', checkAndFullScreenWindow);
    activeWorkspaceChangedId = global.window_manager.connect('switch-workspace', checkAndFullScreenWindow);
}

function disable() {
    windowTracker.disconnect(activeWindowChangedId);
    global.window_manager.disconnect(activeWorkspaceChangedId);
}

function checkAndFullScreenWindow() {
    let activeWorkspace = global.workspace_manager.get_active_workspace_index();
    let windowsOnWorkspace = global.get_window_actors().filter(w => w.meta_window.get_workspace().index() === activeWorkspace && w.meta_window.get_window_type() !== Meta.WindowType.DESKTOP);

    if (windowsOnWorkspace.length === 1 && !windowsOnWorkspace[0].meta_window.maximized_horizontally && !windowsOnWorkspace[0].meta_window.maximized_vertically) {
        windowsOnWorkspace[0].meta_window.maximize(Meta.MaximizeFlags.BOTH);
    }
}

