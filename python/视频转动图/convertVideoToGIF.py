
from moviepy.editor import *

video = "test2.mp4"
clip = VideoFileClip(video)
clip.resize(width=480).write_gif(video.split(".")[0]+".gif", fps=16)
