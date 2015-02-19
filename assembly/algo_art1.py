import cairocffi as cairo
cr = cairo.Context(create_similar)

cr.set_source_rgb(0.0, 0.0, 0.0)
cr.select_font_face("Georgia",
        cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
cr.set_font_size(1.2)
x_bearing, y_bearing, width, height = cr.text_extents("a")[:4]
cr.move_to(0.5 - width / 2 - x_bearing, 0.5 - height / 2 - y_bearing)
cr.show_text("a")
