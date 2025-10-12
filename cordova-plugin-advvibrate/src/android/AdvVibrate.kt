package com.enzo.advvibrate

import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.content.Context
import org.apache.cordova.*
import org.json.JSONArray

class AdvVibrate : CordovaPlugin() {

    override fun execute(action: String, args: JSONArray, callbackContext: CallbackContext): Boolean {
        if (action == "vibrate") {
            val patternJson = args.optJSONArray(0) ?: JSONArray()
            val pattern = LongArray(patternJson.length())
            for (i in 0 until patternJson.length()) pattern[i] = patternJson.optLong(i, 0L)

            val vibrator = cordova.activity.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val finalPattern = if (pattern.isNotEmpty() && pattern[0] != 0L) {
                    longArrayOf(0L, *pattern)
                } else pattern

                val effect = VibrationEffect.createWaveform(finalPattern, -1)
                vibrator.vibrate(effect)
            } else {
                val finalPattern = if (pattern.isNotEmpty() && pattern[0] != 0L) {
                    longArrayOf(0L, *pattern)
                } else pattern
                @Suppress("DEPRECATION")
                vibrator.vibrate(finalPattern, -1)
            }
            callbackContext.success()
            return true
        }
        return false
    }
}
