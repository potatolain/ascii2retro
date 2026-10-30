# ascii2retro

[<img alt="preview" src="assets/preview.png" style="width: 800px;" />](https://ascii2retro.nes.science)

[Try it out!](https://ascii2retro.nes.science)

ascii2retro is a quick simple way to make layouts/nametables/UIs for your retro games. The idea is simple, create ascii/unicode art,
then convert it to an image you can use. The format is fairly simple, so you can also create your own art and upload it to use the
conversion. Finally, the converter is provided as a standalone script/binary, should you want to use this in your own build pipelines.

The conversion is fairly simple, you have an ascii table - optionally adjusted by an arbitrary number of bytes - then each character
can be overridden with a custom replacement byte value.

Note that right now this tool is a hobby project thrown together in a few free hours, so it's pretty rough around the edges. The main
file is huge, I'm using some older React tools, and the editor isn't as efficient as it could be. My goal was more to get something
usable than something well-polished.

Enjoy!

## Features

- Console-agnostic - supports any screen size, and output format is customizable to whatever memory size your console uses
- Simple - can you use a text editor? You can probably figure this out
- Web-based - nothing to download

## Immediate TODO List

- Make resizing the image actually work, after warning about losing data
- implement select tool with drag, delete
- Add some sorta info tip somewhere about making your own for import using the base syntax
- Make file util a separate file and binary
- Support copy/paste?
- Support undo/redo?
- Add a Fill tool?

## File format

To be written! Still iterating on it a tiny bit right now.

## License

MIT License! Do what you want with this. And if you find this useful or make something cool, let me know! Knowing people
use my tools is what keeps me making them, and I don't hear as much as you might think.
