// Background narration: native settings expo-audio's own plugin leaves out.
//
// Android: expo-audio's media playback service (AudioControlsService, a
// media3 MediaSessionService) keeps running after the user swipes the app
// away from Recents while audio is playing, so narration would outlive a
// force-quit. android:stopWithTask="true" makes the system stop the service
// with the task; with no foreground service left, the process ends too.
//
// Works whichever order the manifest mods run in: if expo-audio has already
// added the service it is patched, otherwise it is added here (with the same
// definition expo-audio uses, which then leaves it alone).
//
// iOS needs nothing extra here: "enableBackgroundPlayback": true on the
// expo-audio plugin adds UIBackgroundModes=audio.
const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

const PLAYBACK_SERVICE_NAME = 'expo.modules.audio.service.AudioControlsService';

function applyStopWithTask(manifest) {
  const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
  if (!application.service) application.service = [];
  let service = application.service.find((s) => s.$?.['android:name'] === PLAYBACK_SERVICE_NAME);
  if (!service) {
    service = {
      $: {
        'android:name': PLAYBACK_SERVICE_NAME,
        'android:exported': 'false',
        'android:foregroundServiceType': 'mediaPlayback',
      },
      'intent-filter': [{ action: [{ $: { 'android:name': 'androidx.media3.session.MediaSessionService' } }] }],
    };
    application.service.push(service);
  }
  service.$['android:stopWithTask'] = 'true';
  return manifest;
}

const withNarrationBackgroundAudio = (config) =>
  withAndroidManifest(config, (config) => {
    config.modResults = applyStopWithTask(config.modResults);
    return config;
  });

module.exports = withNarrationBackgroundAudio;
module.exports.applyStopWithTask = applyStopWithTask;
