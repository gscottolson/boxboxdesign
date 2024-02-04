export function findOptionsIndex(focusClass: string) {
    return Options.findIndex((item) => item.focusClass === focusClass);
}

export const Options: Array<{ focusClass: string; title: string; detail: string[] }> = [
    {
        focusClass: 'control-resolution',
        title: 'Resolution',
        detail: [
            'Specifies the desired graphics resolution in pixels. Very high resolutions decrease the graphics performance. If the chosen resolution’s aspect ratio does not match your monitor’s, you may set an adjustment in app.ini (see pixelRatio) to correct for any apparent stretching/squishing.',
        ],
    },
    {
        focusClass: 'control-res-scaling',
        title: 'Res Scaling',
        detail: [
            'Run the simulation at a different resolution than the final output resolution which may give better performance if you are GPU bound. Requires one of the anti-aliasing modes to be enabled (MSAA, TXAA, SMAA)',
        ],
    },
    {
        focusClass: 'control-ui-zoom',
        title: 'UI Zoom',
        detail: ['Allows the simulation’s user interface to be scaled larger or smaller by a percentage.'],
    },
    {
        focusClass: 'control-full-screen',
        title: 'Full Screen',
        detail: [
            'In fullscreen mode the simulation will request a desktop mode switch to the selected resolution, if necessary, and then render to the entire desktop using effecient buffer flips. When unchecked, the simulation instead runs in a resizeable window. Most systems perform best in full-screen mode.',
        ],
    },
    {
        focusClass: 'control-border',
        title: 'Border',
        detail: [
            'In windowed mode the simulation will request a window with a full border and titlebar. When unchecked, the simulation instead runs without border and titlebar.',
        ],
    },
    {
        focusClass: 'control-enable-sps',
        title: 'Enabled SPS (VR)',
        detail: [
            'For VR stereo rendering, enables GPU based Single Pass Stereo (SPS) technology to perform per-eye projections via the GPU, avoiding the CPU overhead associated with rendering each eye separately.',
        ],
    },
    {
        focusClass: 'control-align',
        title: 'Align',
        detail: [
            'Initial window mode alignment. None - Do not change position. Center - center window. Top Left - Align with top left corner of screen',
        ],
    },
    {
        focusClass: 'control-reflex',
        title: 'Reflex',
        detail: [
            'NVIDIA Reflex provides optimizations that reduce sim to render latency. When enabled (on supported hardware/drivers), the device driver enters a low latency mode. Boost mode keeps the GPU clock frequencies high in CPU bound cases.',
        ],
    },
    // {
    //     focusClass: 'control-monitors',
    //     title: 'Monitors',
    //     detail: [],
    // },
    {
        focusClass: 'control-gamma',
        title: 'Gamma',
        detail: [
            'Alters the gamma encoding used for the current display during the tone mapping post process, requires HDR rendering to be active.',
        ],
    },
    {
        focusClass: 'control-brightness',
        title: 'Brightness',
        detail: [
            'Alters the intensity of the rendered scene during the tone mapping post process, requires HDR rendering to be active.',
        ],
    },
    {
        focusClass: 'control-contrast',
        title: 'Contrast',
        detail: [
            'Alters the intensity of the rendered scene during the tone mapping post process, requires HDR rendering to be active.',
        ],
    },
    {
        focusClass: 'control-quality-slider',
        title: 'Quality vs Performance Presets',
        detail: [
            'For rough performance adjustments, simply move this slider as far left (towards max quality) as you can while still able to maintain a playable frame rate in online sessions with many cars on track. You must restart the session for the settings to take full effect.',
        ],
    },
    {
        focusClass: 'control-sky-clouds',
        title: 'Sky/Clouds',
        detail: [
            'Lowering the sky detail may significantly improve frame rate. It may cause the sky/clouds images and shadows to refresh at a lower rate (and appear jumpy), and may adjust the sky’s resolution. Typically set this higher in the replay settings.',
        ],
    },
    {
        focusClass: 'control-cars',
        title: 'Cars',
        detail: [
            'Lowering the car detail may significantly improve frame rate when many cars are visible, particularly during race starts when driving within a large a pack of many nearby cars. Typically set this higher in the replay settings where FPS is less important.',
        ],
    },
    {
        focusClass: 'control-pit-objects',
        title: 'Pit Objects',
        detail: [
            'Lowering the pitbox detail may improve frame rates when the pit area is visible on screen. Typically set this higher in the replay settings where FPS is less important.',
        ],
    },
    {
        focusClass: 'control-event',
        title: 'Event',
        detail: [
            'Lowering the event detail reduces the object complexity around the track, especially in race sessions where more objects are active.',
        ],
    },
    {
        focusClass: 'control-grandstands',
        title: 'Grandstands',
        detail: [
            'Due to the very high detail and complexity of the grandstands, lowering the grandstand detail may significantly improve frame rates. Typically set this higher in the replay settings where FPS is less important.',
        ],
    },
    {
        focusClass: 'control-crowds',
        title: 'Crowds',
        detail: [
            'Lowering crowd detail may improve frame rate. This setting controls how detailed the crowds are. Off will display no crowds. Low will display crowds in the stands and around the track, but only their fronts will render. Medium will display the crowds with both their fronts and backs. High will add 3D characters',
        ],
    },
    {
        focusClass: 'control-objects',
        title: 'Objects',
        detail: [
            'Lowering the object detail causes trackside objects to render at lower levels of detail, which improves frame rates. Typically set this higher in the replay settings where FPS is less important.',
        ],
    },
    {
        focusClass: 'control-foliage',
        title: 'Foliage',
        detail: [
            'This setting configures the detail level of 3D foliage (grass and weeds). Off will render no foliage. Low, Medium, and High will each render foliage at an increasing level of complexity. Lowering the Foliage detail level may improve frame rate. Turning Foliage off or on requires a restart of the sim.',
            'Changes to this settings take effect only after exiting the session.',
        ],
    },
    {
        focusClass: 'control-particles',
        title: 'Particles',
        detail: [
            'The particles detail may affect the frame rate when at high detail. Lowering the particles to medium or lower may improve frame rate',
        ],
    },
    {
        focusClass: 'control-full-res',
        title: 'Particles: Full Res',
        detail: [
            'Turning off this option will increase frame rate in high smoke/dust situations but will decrease frame rate slightly overall. This will increase smoke aliasing against the world.',
        ],
    },
    {
        focusClass: 'control-soft',
        title: 'Particles: Soft',
        detail: [
            'Turning on this option will soften particle edges where they intersect with the world at a slight frame rate cost.',
        ],
    },
    {
        focusClass: 'control-max-cars',
        title: 'Max Cars',
        detail: [
            'This setting controls how many cars you are requesting the server send to your client. The server may not honor your request, and may send fewer, depending on available bandwidth. Lowering this value may significantly improve frame rate and also reduce replay file sizes. You will only see, and record to your replay, the N cars closest to you which the server transmits to your client.',
        ],
    },
    {
        focusClass: 'control-draw-cars',
        title: 'Draw Cars',
        detail: [
            'This setting controls how may cars will draw in mirrors and in other cameras. The first value is the limit for main cameras, and the value in parentheses is the limit inside mirrors. Can help improve frame rate in events with many entrants by not drawing the least important cars relative to the camera.',
        ],
    },
    {
        focusClass: 'control-draw-pits',
        title: 'Draw Pits',
        detail: [
            'This setting controls how may pit stall related objects draw in mirrors and in other cameras. The first value is the limit for main cameras, and the value in parentheses is the limit inside mirrors. Can help improve frame rate in events with many entrants.',
        ],
    },
    {
        focusClass: 'control-dynamic-lod',
        title: 'Dynamic LOD FPS',
        detail: [
            'Dynamically adjusts the level-of-detail of cars, pit objects, and world to help maintain a minimum acceptable frame rate.',
            'If the FPS is below the target, LODs will drop to improve FPS.',
            'If the FPS is high, the LODs increase again.',
            ' The droplists of presets control how much the LODs are allowed to change from normal.',
        ],
    },
    // {
    //     focusClass: 'control-lod-world',
    //     title: 'Dynamic LOD World',
    //     detail: ['???'],
    // },
    // {
    //     focusClass: 'control-lod-cars',
    //     title: 'Dynamic LOD Cars',
    //     detail: ['???'],
    // },
    {
        focusClass: 'control-frame-rate',
        title: 'Frame Rate',
        detail: [
            'The frame rate, or frames per second (FPS) is a measure of how many animation frames are rendered and displayed per second. Frame rates below 30 FPS are generally consider unplayable, and frame rates much above 60 fps are often considered excessive.',
        ],
    },
    {
        focusClass: 'control-no-limit',
        title: 'No Limit',
        detail: [
            'This option causes the simulation to render frames as rapidly as possible. If you have very high frame rates, you may be able to increase quality. Setting a limit to reduce your frame rate (recommended) may reduce power usage and the temperature inside your computer.',
        ],
    },
    {
        focusClass: 'control-limit',
        title: 'Limit',
        detail: [
            'This setting requests the renderer to sleep between frames whenever the system is exceeding the specified frame rate. When active, your system may consume less power, and also generate less internal heat. Also, setting this value away from your monitor’s refresh rate may avoid frame tearing appearing in the same spot frame after frame.',
        ],
    },
    {
        focusClass: 'control-vertical-sync',
        title: 'Vertical Sync',
        detail: [
            'This option is only available in full-screen modes, and requests that rendered frames be presented only during the monitor vertical sync (at the refresh rate), which prevents visible screen tearing. Enabling this option often causes the simulation’s frame rate to appear smoother, but may noticeably increase controller lag. Some device drivers do not honor this setting in multi-monitor situations.',
        ],
    },
    {
        focusClass: 'control-anisotropic-filtering',
        title: 'Anisotropic Filtering',
        detail: [
            'Anisotropic filtering improves texture quality when polygons are viewed edge on, such as the track surfaces and on the hoods of cars.',
        ],
    },
    {
        focusClass: 'control-msaa-samples',
        title: 'MSAA Samples',
        detail: [
            'Anti-aliasing reduces the appearance of jaggy triangle edges in the rendered scenes. Anti-aliasing typically consumes a lot of video memory, and also drastically reduces frame rate since many more pixels are rendered per frame. Reducing AA can significantly improve FPS and improve texture quality due to freeing up video memory (on some GPUs).',
        ],
    },
    {
        focusClass: 'control-render-dynamic',
        title: 'Render Dynamic Track Data',
        detail: [
            'This option enables or disables rendering of dynamic track data (rubber, marbles, dust). Disabling improves rendering performance',
        ],
    },
    {
        focusClass: 'control-shadow-maps',
        title: 'Shadow maps/Cloud Shadows',
        detail: [
            'Shadow maps are a shadow method where shadows are rendered into textures that are then projected onto the scene. This setting allows you to specify which objects receive the projected shadow textures. Casting them on the cars and track doesn’t affect FPS too much, while casting them on the terrain can be more costly.',
        ],
    },
    {
        focusClass: 'control-object-self-shadowing',
        title: 'Object Self Shadowing',
        detail: ['Allows trackside objects that cast into static shadow maps to also receive shadows from shadow maps'],
    },
    {
        focusClass: 'control-dynamic-objs',
        title: 'Dynamic Objects',
        detail: [
            'This option causes cars, pit boxes, and other dynamic objects and a few select trackside objects to render their shadows using an advanced shadow map technology, consumes approx 50MB of video memory.',
        ],
    },
    {
        focusClass: 'control-night-shadow-maps',
        title: 'Night Shadow Maps',
        detail: [
            'This option enables the use of shadow maps for night lighting. This method is preferred over shadow volumes since the performance is signficantly better. Shadows may appear less sharp. You may need to restart for this option to take effect.',
        ],
    },
    {
        focusClass: 'control-walls',
        title: 'Walls',
        detail: ['Enabling this option will cause the track walls to cast shadows at the cost of some performance'],
    },
    {
        focusClass: 'control-number-of-lights',
        title: 'Number of Lights',
        detail: [
            'This option controls the number of lights that can cast shadows. More lights improve visual quality at the cost of performance.',
        ],
    },
    {
        focusClass: 'control-filter',
        title: 'Filter',
        detail: [
            'This option controls the kind of filtering to apply to the shadow maps, better filters improve visual quality at the cost of performance.',
        ],
    },
    {
        focusClass: 'control-dynamic-cubemaps',
        title: 'Dynamic Cubemaps',
        detail: ['This option controls the number of dynamic (cars/cockpit) cubemaps rendered per-frame.'],
    },
    {
        focusClass: 'control-fixed-cubemaps',
        title: 'Fixed Cubemaps',
        detail: ['This option controls the number of fixed (track objects) cubemaps rendered per-frame'],
    },
    {
        focusClass: 'control-shader-quality',
        title: 'Shader Quality',
        detail: [
            'Controls the visual quality from shaders. Higher quality means more GPU processing is required but better visual quality. Lower quality values may improve performance.',
        ],
    },
    {
        focusClass: 'control-hide-obstructions',
        title: 'Hide Obstructions',
        detail: [
            'Cockpit obstructions are made visually transparent while in-car.',
            'Options: None, Cockpit halo, Pillar/rockcage, All',
        ],
    },
    {
        focusClass: 'control-cockpit',
        title: 'Cockpit Options',
        detail: [
            'The setting can be used to enable the steering wheel or the steering wheel and driver arms in the cockpit view. Enabling the driver arms may decrease performance, and requires vertex shaders to be enabled.',
        ],
    },
    {
        focusClass: 'control-two-pass-trees',
        title: 'Two Pass Trees',
        detail: [
            'Enabling this option renders the trees as two passes with higher quality. Disabling renders a single pass with worse visual quality but higher performance',
        ],
    },
    {
        focusClass: 'control-high-quality-trees',
        title: 'High Quality Trees',
        detail: [
            'Enabling this option renders the trees at a higher quality. Disabling will have worse visual quality but higher performance.',
            'Requires restart to take effect.',
        ],
    },
    {
        focusClass: 'control-cockpit-mirrors-max',
        title: 'Cockpit Mirrors Max',
        detail: [
            'Cockpit mirrors enable the side mirrors, rear view mirrors, and computer screens (in applicable cars). Use of cockpit mirrors may significantly reduce frame rate.',
        ],
    },
    {
        focusClass: 'control-higher-detail-mirrors',
        title: 'Higher Detail in Mirrors',
        detail: [
            'Use this setting to render additional items into the mirrors. This setting often significantly reduces frame rate without providing much value, as such it isn’t often recommended.',
        ],
    },
    {
        focusClass: 'control-headlights',
        title: 'Headlights',
        detail: [
            'The headlight detail affects the frame rate at night tracks with cars on track that have headlights. Lowering the headlight detail may improve frame rates at night tracks',
        ],
    },
    {
        focusClass: 'control-headlights-on-track',
        title: 'Headlights on track in mirrors',
        detail: [
            'This setting causes the headlight effects at night tracks to be visible within mirrors. Recommended only for higher-end systems.',
        ],
    },
    {
        focusClass: 'control-virtual-mirror',
        title: 'Virtual Mirror FOV',
        detail: [
            'The virtual mirror provides you with a rear facing viewport placed at the top of the screen, which often provides a more useful rear view than the cockpit mirrors.',
        ],
    },
    {
        focusClass: 'control-motion-blur',
        title: 'Motion Blur',
        detail: [
            'Motion Blur is a post processing effect which will blur objects and scenery that are moving across the screen quickly. This feature can affect performance, especially on high resolution displays and multi-monitor setups.',
        ],
    },
    {
        focusClass: 'control-anti-aliasing',
        title: 'Anti-Aliasing',
        detail: [
            'Change how smoothly images are displayed. FXAA offers good smoothing at low cost to performance. SMAA offers superior quality smoothing at higher cost than FXAA.',
        ],
    },
    {
        focusClass: 'control-ssr',
        title: 'Screen Space Reflections',
        detail: [
            'This enables Screen Space Reflections for rain puddles and some other bodies of water. This post process step is expensive, and uses the GPU heavily. Using  the Low setting decreases quality slightly but is highly recommended if running a very high resolution (triples or 4K+ w/high MSAA levels). The “rain only” modes toggle it on/off only when race control declares “wet rules” are in effect, so it doesn’t affect performance much in dry track conditions (recommended!)',
        ],
    },
    {
        focusClass: 'control-sharpening',
        title: 'Sharpening',
        detail: [
            'This enables sharpening effects. This option consumes a lot of video memory, which may adversely affect texture quality.',
        ],
    },
    {
        focusClass: 'control-distortion',
        title: 'Distortion',
        detail: [
            'This enables distortion particle effects. This option consumes a lot of video memory, which may adversely affect texture quality.',
        ],
    },
    {
        focusClass: 'control-hdr',
        title: 'High Dynamic Range',
        detail: [
            'This enables high dynamic range rendering. This option consumes a lot of video memory, which may adversely affect texture quality. This option requires a restart for changes to take effect.',
        ],
    },
    {
        focusClass: 'control-heat-haze',
        title: 'Heat Haze',
        detail: [
            'This enables heat haze effects. This option consumes a lot of video memory, which may adversely affect texture quality.',
        ],
    },
    {
        focusClass: 'control-ssao',
        title: 'Screen Space Ambient Occlusion',
        detail: [
            'This enables screen space ambient occlusion. This feature gives more depth to the scene by generating extra shadowing, but may affect framerate, and degrade texture quality due to video memory limitations on older computers/GPUs.',
        ],
    },
    {
        focusClass: 'control-video-mem-swap',
        title: 'Video memory swap high-resolution cars',
        detail: [
            'For systems with limited video memory, this is a recommend option. The 3 closest cars to the camera will render with higher quality textures, and as these cars change, the high res versions of car textures swap into video memory as required.',
        ],
    },
    {
        focusClass: 'control-car-textures',
        title: '2048×2048 car textures',
        detail: [
            'Use higher resolution textures for car paint jobs, if possible. Only enable this option if you have a large amount of system RAM and video RAM as this option can utilize an additional 150 MB of textures.',
        ],
    },
    {
        focusClass: 'control-hide-car-numbers',
        title: 'Hide car numbers',
        detail: [
            'Use this option to try and load custom car paints that have the car numbers baked into them. If found then this will turn off the iRacing provided car numbers and sponsor decals for each of the cars with custom paints applied. This will enable you to paint over the numbers and decal areas with your own graphics.',
        ],
    },
];
