from manim import *
import numpy as np

class Corazon(Scene):
    def construct(self):
        ejes = Axes(
            x_range=[-2, 2, 0.1],
            y_range=[-1, 2, 0.1],
            axis_config={"color": WHITE},
            x_length=7,
            y_length=6,
            x_axis_config={"tick_size": 0.05},
            y_axis_config={"tick_size": 0.05}
        )
        ejes.shift(UP * 1)

        k_tracker = ValueTracker(0.00)

        titulo = Text("¿Quieres ser mi crush?", font_size=48, color=RED)
        titulo.move_to(ejes.get_bottom()).shift(DOWN * 0.5)

        exp = MathTex(
            r"(x^2)^{1/3} + 0.7 \cdot \sin(k \cdot x) \cdot \sqrt{3 - x^2}",
            font_size=38, color=WHITE
        )
        exp.move_to(titulo.get_bottom()).shift(DOWN * 0.4)

        k_value_ltx = MathTex("k = ", font_size=38, color=WHITE)
        k_value_ltx.move_to(exp.get_bottom()).shift(DOWN * 0.4)

        k_texto = always_redraw(
            lambda: Text(
                f"{k_tracker.get_value():.2f}",
                font_size=28, color=WHITE
            ).move_to(k_value_ltx.get_right()).shift(RIGHT * 0.4)
        )

        graph = always_redraw(
            lambda: ejes.plot(
                lambda x: (x**2)**(1/3) + 0.7 * np.sin(k_tracker.get_value() * x) * np.sqrt(3 - x**2),
                x_range=[-np.sqrt(3), np.sqrt(3)],
                color=RED
            )
        )

        self.play(DrawBorderThenFill(ejes))
        self.play(Create(graph))
        self.play(Write(titulo))
        self.play(Write(exp))
        self.play(Write(k_value_ltx))
        self.play(Write(k_texto))
        self.play(k_tracker.animate.set_value(100.00), run_time=10)
        self.wait(2)