
from moviepy.editor import *

video = "test.mp4"
clip = VideoFileClip(video)
clip.resize(width=480).write_gif("output.gif", fps=16)
