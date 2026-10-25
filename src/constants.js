const DEFAULT_WIDTH = 32,
  DEFAULT_HEIGHT = 30,
  CHAR_SIZE_W_BORDER_PX_X = 26,
  CHAR_SIZE_W_BORDER_PX_Y = 25.5,
  TOOL_TYPES = ["draw", "select", "rect", "type"],
  BOX_STYLES = [
    { name: "Default", tl: "┌", tr: "┐", bl: "└", br: "┘", horz: "─", vert: "│" },
    { name: "Bold", tl: "┏", tr: "┓", bl: "┗", br: "┛", horz: "━", vert: "┃" },
    { name: "Double", tl: "╔", tr: "╗", bl: "┗", br: "┛", horz: "═", vert: "║" },
    { name: "Empty", tl: " ", tr: " ", bl: " ", br: " ", horz: " ", vert: " " },
  ];

export { DEFAULT_HEIGHT, DEFAULT_WIDTH, CHAR_SIZE_W_BORDER_PX_X, CHAR_SIZE_W_BORDER_PX_Y, TOOL_TYPES, BOX_STYLES };
