require 'json'

namespace :metrics do
  task :comment_histogram => :environment do
    data = []
    Product.find_each do |product|
      next if product.comment_responsiveness < 1
      data << {
        "product" => product.slug,
        "cr" => product.comment_responsiveness
      }
    end
    File.open("comment_histogram.json","w") do |f|
      f.write(data.to_json)
    end
  end
  task :comment_histogram => :environment do
    data = []
    Product.find_each do |product|
      next if product.comment_responsiveness < 1
      data << {
        "product" => product.slug,
        "cr" => product.comment_responsiveness
      }
    end
    File.open("comment_histogram.json","w") do |f|
      f.write(data.to_json)
    end
  end
end


