
from moviepy import VideoFileClip, AudioFileClip


def get_media_duration(file_path: str):

    clip = None

    try:

        file_lower = file_path.lower()

        # =====================================================
        # AUDIO FILES
        # =====================================================

        if file_lower.endswith(
            (".mp3", ".wav", ".m4a", ".aac", ".flac")
        ):

            clip = AudioFileClip(file_path)

        # =====================================================
        # VIDEO FILES
        # =====================================================

        elif file_lower.endswith(
            (".mp4", ".mov", ".avi", ".mkv")
        ):

            clip = VideoFileClip(file_path)

        # =====================================================
        # UNSUPPORTED FILE
        # =====================================================

        else:

            print("Unsupported media format")

            return None

        # =====================================================
        # GET DURATION
        # =====================================================

        duration = clip.duration

        if duration is None:

            print("Could not determine media duration")

            return None

        duration = int(round(duration))

        print(
            f"Media duration: {duration} seconds"
        )

        return duration

    except Exception as e:

        print(
            "Duration calculation error:",
            str(e)
        )

        return None

    finally:

        # =====================================================
        # CLOSE MEDIA FILE
        # =====================================================

        if clip is not None:

            try:
                clip.close()
            except Exception:
                pass

