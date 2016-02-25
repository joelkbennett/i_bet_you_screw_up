helpers do
  # def current_user
  #   @current_user = User.find(session[:id]) if session[:id]
  # end

  def current_user
    @current_user = User.find(4)
  end

  def all_promises
    @promises = Promise.all
  end

  def all_bets
    @bets = Bet.all
  end

  def a_promise(promise_id)
    @promise = Promise.find(promise_id)
  end

  def all_bets_on_a_promise(promise_id)
    @all_bets_on_a_promise = Bet.where("promise_id = ?", promise_id)
  end

  def user_of_the_promise(user_id)
    @user_of_the_promise = User.find(user_id)
  end

  def all_bets_of_a_user(user_id)
    @all_bets_of_a_user = Bet.where("user_id = ?", user_id)
  end

  def bet_for_a_user_on_a_promise(user_id, promise_id)
    Bet.where("user_id = ? AND promise_id = ?", user_id, promise_id).take(1)[0]
  end
end

before do
  current_user
  all_promises
  all_bets
end

get '/' do
  erb :index
end

get '/promises' do
  erb :'promises/index'
end

get '/promises/:id' do |id|
  a_promise(id)
  user_of_the_promise(@promise.user_id)
  all_bets_on_a_promise(id)
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  erb :'promises/show'
end

post '/promises/:id/new_bet' do |id|
  a_promise(id)
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  user_of_the_promise(@promise.user_id)
  @bet = Bet.new(
    bet_value: params[:bet_value],
    in_favour: true,
    user_id: @current_user.id,
    promise_id: id
  )
  @bet.save
  erb :'promises/show'
end