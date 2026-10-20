from PIL import Image

img = Image.open("Aluno1.jpeg")

img.save("Aluno1.webp", "webp", quality=80)
