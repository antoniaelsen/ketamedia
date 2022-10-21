from analyzer import analyzer

if __name__ == "__main__":
  analyzer = analyzer.Analyzer()
  output = analyzer.run()
  print(f'output: {output}')
